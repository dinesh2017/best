const asyncHandler = require("express-async-handler");
const User = require("../models/auth/user.model")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const APIError = require('../utils/APIError');


exports.register = asyncHandler(async (req, res, next) => {
    try {

        let { fcmId, countryCode, mobile, name, email, password, platformType = "ANDROID" } = req.body
        mobileDeviceInfo = { fcmId, platformType };
        if (!name || !email || !mobile || !password) {
            next(new APIError({message:`Please entered required fields`, status : 200}));
        }
        let _mobile = {
            countryCode,
            number: mobile
        }
        let _user = await User.getByMobile(_mobile)
        if (_user) {
            next(new APIError({message:`A user with that mobile/email already exists`, status : 200}));
        } else {

            let { otp } = req.locals
            const hashedPassword = await bcrypt.hash(password, 10);
            _user = await User.create({ mobile: _mobile, email, name, password: hashedPassword });
            const { user, accessToken } = await User.findAndGenerateToken({ mobile: _user.mobile });
            res.status(201).json({
                status : 200,
                message: "SUCCESS",
                user,
                otp: otp,
                accessToken,
            });
        }

    } catch (err) {
        next(new APIError({message:`Registration Failed`}));
    }
})

exports.login = asyncHandler(async (req, res, next) => {
    try {
        let { fcmId, countryCode, mobile, email, password, platformType = "ANDROID" } = req.body;
        if (!mobile && !password) {
            next(new APIError({message:`Please entered required fields`, status : 200}));
        }
        mobileDeviceInfo = { fcmId, platformType };
        let _mobile = {
            countryCode,
            number: mobile
        }
        let _user = await User.getByMobile(_mobile);

        if (_user == null) {
            next(new APIError({message:`User not found`, status : 200}));
        }
        if (await bcrypt.compare(password, _user.password)) {
            _user.mobileDeviceInfo = mobileDeviceInfo
            _user.mobile = _mobile;
            if (fcmId) {
                _user.mobileDeviceInfo.fcmId = fcmId;
            }
            await _user.save();
            const { user, accessToken } = await User.findAndGenerateToken({ mobile: _user.mobile })
            res.status(200).json({
                status : 200,
                message: "SUCCESS",
                user,
                accessToken,
            });
        } else {
            next(new APIError({message:`The username or password you entered is incorrect..`, status : 401}));
        }
    } catch (err) {
        next(new APIError({message:`Login Failed`}));
    }

});
