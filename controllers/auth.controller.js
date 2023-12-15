const asyncHandler = require("express-async-handler");
const User = require("../models/auth/user.model")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const APIError = require('../utils/APIError');
const otpService = require("../services/otp.services")


exports.changeUserPassword = asyncHandler(async (req, res, next) => {
    try {
        let { password, oldPassword } = req.body;
        let { entity } = req.user;
        let _user = await User.findById(entity);
        const hashedPassword = await bcrypt.hash(password, 10);
        const passwordMatch = await bcrypt.compare(oldPassword, _user.password);
        if(!passwordMatch){
            return next(new APIError({ message: `Old Password doesn't match`, status: 401 }));
        }
        const updatedUser = await User.findByIdAndUpdate(_user.id, {password: hashedPassword}, { new: true });
        return res.status(200).json({
            status: 200,
            message: "SUCCESS",
        });
    } catch (err) {
        console.log(err)
        return next(new APIError({ message: `Change Password Failed` }));
    }
});

exports.changePassword = asyncHandler(async (req, res, next) => {
    try {
        let { password, mobile, email,countryCode } = req.body;
        let _mobile = {
            countryCode,
            number: mobile
        }
        let _user = await User.getByMobileOrEmail(_mobile, email)
        if(!_user){
            return next(new APIError({ message: `User doesn't exists`, status: 401 }));
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const updatedUser = await User.findByIdAndUpdate(_user.id, {password: hashedPassword}, { new: true });
        return res.status(200).json({
            status: 200,
            message: "SUCCESS",
        });
    } catch (err) {
        return next(new APIError({ message: `Change Password Failed` }));
    }
});

exports.register = asyncHandler(async (req, res, next) => {
    try {

        let { fcmId, countryCode, mobile, name, email, otp, password, platformType = "ANDROID" } = req.body
        mobileDeviceInfo = { fcmId, platformType };
        if (!name || !email || !mobile || !password) {
            return next(new APIError({ message: `Please entered required fields`, status: 203 }));
        }
        let _mobile = {
            countryCode,
            number: mobile
        }
        let _user = await User.getByMobile(_mobile)
        if (_user) {
            return next(new APIError({ message: `A user with that mobile/email already exists`, status: 203 }));
        } else {

            const hashedPassword = await bcrypt.hash(password, 10);
            _user = await User.create({ mobile: _mobile, email, name, password: hashedPassword });
            const { user, accessToken } = await User.findAndGenerateToken({ mobile: _user.mobile });
            return res.status(200).json({
                status: 200,
                message: "SUCCESS",
                user,
                accessToken,
            });
        }

    } catch (err) {
        next(new APIError({ message: `Registration Failed` }));
    }
})

exports.login = asyncHandler(async (req, res, next) => {
    try {
        let { fcmId, countryCode, mobile, email, password, platformType = "ANDROID" } = req.body;
        if (!mobile && !password) {
            return next(new APIError({ message: `Please entered required fields`, status: 203 }));
        }
        mobileDeviceInfo = { fcmId, platformType };
        let _mobile = {
            countryCode,
            number: mobile
        }
        let _user = await User.getByMobile(_mobile);

        if (_user == null) {
            return next(new APIError({ message: `User not found`, status: 404 }));
        }
        if (await bcrypt.compare(password, _user.password)) {
            _user.mobileDeviceInfo = mobileDeviceInfo
            _user.mobile = _mobile;
            if (fcmId) {
                _user.mobileDeviceInfo.fcmId = fcmId;
            }
            await _user.save();
            const { user, accessToken } = await User.findAndGenerateToken({ mobile: _user.mobile })
            return res.status(200).json({
                status: 200,
                message: "SUCCESS",
                user,
                accessToken,
            });
        } else {
            return next(new APIError({ message: `The username or password you entered is incorrect..`, status: 401 }));
        }
    } catch (err) {
        return next(new APIError({ message: `Login Failed` }));
    }

});

exports.verifyuser = asyncHandler(async (req, res, next) => {
    try {
        let { mobile, countryCode, email } = req.body
        let _mobile = {
            countryCode,
            number: mobile
        }
        if (!email && !mobile) {
            return next(new APIError({ message: `Please entered required fields`, status: 203 }));
        }
        let _user = await User.getByMobileOrEmail(_mobile, email)
        if (_user) {
            return next(new APIError({ message: `A user with that mobile/email already exists`, status: 203 }));
        } else {
            let { otp } = await otpService.sendOtp_(_mobile, email);
            return res.status(200).json({
                status: 200,
                message: "SUCCESS",
                otp: otp,
            });
        }
    } catch (err) {
        return next(new APIError({ message: `Verification Failed` }));
    }
});

exports.checkuser = asyncHandler(async (req, res, next) => {
    try {
        let { mobile, countryCode, email } = req.body
        let _mobile = {
            countryCode,
            number: mobile
        }
        if (!email && !mobile) {
            return next(new APIError({ message: `Please entered required fields`, status: 203 }));
        }
        let _user = await User.getByMobileOrEmail(_mobile, email)
        if (!_user) {
            return next(new APIError({ message: `User does not exists`, status: 203 }));
        } else {
            let { otp } = await otpService.sendOtp_(_mobile, email);
            return res.status(200).json({
                status: 200,
                message: "SUCCESS",
                otp: otp,
            });
        }
    } catch (err) {
        return next(new APIError({ message: `Verification Failed` }));
    }
});