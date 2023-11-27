const asyncHandler = require("express-async-handler");
const User = require("../models/auth/user.model")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



exports.register = asyncHandler(async (req, res) => {
    let { fcmId, countryCode, mobile, name, email, password, platformType = "ANDROID" } = req.body
    mobileDeviceInfo = { fcmId, platformType };
    if (!name || !email || !mobile || !password) {
        res.status(400)
        throw new Error("Please enter required fields");
    }
    let _mobile = {
        countryCode,
        number: mobile
    }
    let _user = await User.getByMobile(_mobile)
    if (_user) {
        res.status(402);
        throw new Error("User already exists")
    } else {
        try{
            let { otp } = req.locals
            const hashedPassword = await bcrypt.hash(password, 10);
            _user = await User.create({ mobile: _mobile, email, name, password: hashedPassword });
            const { user, accessToken } = await User.findAndGenerateToken({ mobile: _user.mobile });
            res.status(201).json({
                message: "OK",
                user,
                otp:otp,
                accessToken,
            });
        }catch(err){
            res.status(500);
            throw new Error(err.message)
        }
        
    }
})

exports.login = asyncHandler(async (req, res) => {
    
        let { fcmId, countryCode, mobile, email, password, platformType = "ANDROID" } = req.body;
        if (!mobile && !password) {
            res.status(400);
            throw new Error("All fields required")
        }
        mobileDeviceInfo = { fcmId, platformType };
        let _mobile = {
            countryCode,
            number: mobile
        }
        let _user = await User.getByMobile(_mobile);
        
        if (_user == null) {
            res.status(401);
            throw new Error("Unauthorized : User not found")
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
                user,
                accessToken,
            });
        } else {
            res.status(401);
            throw new Error("User password invalid")
        }
    
});
