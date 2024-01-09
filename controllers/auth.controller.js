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

exports.updateUserProfile = asyncHandler(async (req, res, next) => {
    try {
    let { email, countryCode, mobile, name } = req.body;
        let { entity } = req.user;
        let _user = await User.findById(entity);
        if(!_user){
            return res.status(200).json({
                message: `User doesn't exists`, status: 401
            });
        }
        let _mobile = {
            countryCode,
            number: mobile
        }
        const updatedUser = await User.findByIdAndUpdate(_user.id, {email, mobile:_mobile, name}, { new: true });
        return res.status(200).json({
            status: 200,
            message: "SUCCESS",
            user : updatedUser
        });
        
    } catch (err) {
        console.log(err)
        return next(new APIError({ message: `Update User Failed` }));
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
            return res.status(200).json({
                message: `User doesn't exists`, status: 401
            });
            // return next(new APIError({ message: `User doesn't exists`, status: 401 }));
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

        let { fcmId, countryCode,from, mobile, name, email, otp, password, platformType = "ANDROID" } = req.body
        mobileDeviceInfo = { fcmId, platformType };
        if (!name  || !password) {
            return res.status(200).json({
                message: `Please entered required fields`, status: 203
            });
        }
        let _user = null;
        let _mobile = null;let errorMsg = "";
        if(mobile){
            _mobile = {
                countryCode,
                number: mobile
            }
            _user = await User.getByMobile(_mobile)
            errorMsg = "A user with that mobile already exists"
        }

        if(email){
            _user = await User.getByMobileOrEmail("",email)
            errorMsg = "A user with that email already exists"
        }
        if (_user) {
            return res.status(200).json({
                message: errorMsg, status: 203
            });
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            if(email == ""){
                email = null;
            }
            _user = await User.create({ mobile: _mobile, email, name, from, password: hashedPassword });
            const { user, accessToken } = await User.findAndGenerateToken({ mobile: _user.mobile });
            return res.status(200).json({
                status: 200,
                message: "SUCCESS",
                user,
                accessToken,
            });
        }

    } catch (err) {
        console.log(err)
        next(new APIError({ message: `Registration Failed` }));
    }
})

exports.login = asyncHandler(async (req, res, next) => {
    try {
        let { fcmId, countryCode, mobile, email, password, platformType = "ANDROID" } = req.body;
        if(email && !password){
            console.log(email)
            mobileDeviceInfo = { fcmId, platformType };
            let _user = await User.getByMobileOrEmail("",email);
            if (_user == null) {
                return res.status(200).json({
                    status: 404,
                    message: `User not found`,
                });
            }
            
            _user.mobileDeviceInfo = mobileDeviceInfo
            
            if (fcmId) {
                _user.mobileDeviceInfo.fcmId = fcmId;
            }
            await _user.save();
            const { user, accessToken } = await User.findAndGenerateTokenByEmail({ email: email })
            return res.status(200).json({
                status: 200,
                message: "SUCCESS",
                isExisted : true,
                user,
                accessToken,
            });
        }else if(email && password){

            if (!email && !password) {
                return res.status(200).json({
                    status: 203,
                    message: 'Please entered required fields',
                });
            }
            mobileDeviceInfo = { fcmId, platformType };
            
            let _user = await User.getByMobileOrEmail("",email);
            
    
            if (_user == null) {
                return res.status(200).json({
                    status: 404,
                    message: `User not found`,
                });
            }
            if (await bcrypt.compare(password, _user.password)) {
                _user.mobileDeviceInfo = mobileDeviceInfo
                if (fcmId) {
                    _user.mobileDeviceInfo.fcmId = fcmId;
                }
                await _user.save();
                const { user, accessToken } = await User.findAndGenerateTokenByEmail({ email: _user.email })
                return res.status(200).json({
                    status: 200,
                    message: "SUCCESS",
                    user,
                    accessToken,
                });
            } else {
                return res.status(200).json({
                    status: 401,
                    message: `The username or password you entered is incorrect..`,
                });
            }

        }else{
            if (!mobile && !password) {
                return res.status(200).json({
                    status: 203,
                    message: 'Please entered required fields',
                });
            }
            mobileDeviceInfo = { fcmId, platformType };
            let _mobile = {
                countryCode,
                number: mobile
            }
            let _user = await User.getByMobile(_mobile);
    
            if (_user == null) {
                return res.status(200).json({
                    status: 404,
                    message: `User not found`,
                });
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
                return res.status(200).json({
                    status: 401,
                    message: `The username or password you entered is incorrect..`,
                });
            }
        }
        
    } catch (err) {
        return next(new APIError({ message: `Login Failed` }));
    }

});

exports.verifyuser = asyncHandler(async (req, res, next) => {
    try {
        let { mobile, countryCode,  email } = req.body
        let _mobile = {
            countryCode,
            number: mobile
        }
        if (!email && !mobile) {
            return res.status(200).json({
                message: `Please entered required fields`, status: 203
            });
            // return next(new APIError({ message: `Please entered required fields`, status: 203 }));
        }
        let _user = await User.getByMobileOrEmail(_mobile, email)
        if (_user) {
            return res.status(200).json({
                message: `A user with that mobile/email already exists`, 
                status: 203
            });
            // return next(new APIError({ message: `A user with that mobile/email already exists`, status: 203 }));
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
            return res.status(200).json({
                message: `Please entered required fields`, status: 203
            });
            // return next(new APIError({ message: `Please entered required fields`, status: 203 }));
        }
        let _user = await User.getByMobileOrEmail(_mobile, email)
        if (!_user) {
            return res.status(200).json({
                message: `User does not exists`, status: 203
            });
            // return next(new APIError({ message: `User does not exists`, status: 203 }));
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