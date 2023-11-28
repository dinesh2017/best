const asyncHandler = require("express-async-handler");
const OTP = require("../models/otp.model")

var digits = '0123456789'
var alphabets = 'abcdefghijklmnopqrstuvwxyz'
var upperCase = alphabets.toUpperCase()
var specialChars = '#!&@'
function rand(min, max) {
    var random = Math.random()
    return Math.floor(random * (max - min) + min)
}

exports.generate = (length, options) => {
    length = length || 10
    var generateOptions = options || {}
    generateOptions.digits = generateOptions.hasOwnProperty('digits') ? options.digits : true
    generateOptions.alphabets = generateOptions.hasOwnProperty('alphabets') ? options.alphabets : false
    generateOptions.upperCase = generateOptions.hasOwnProperty('upperCase') ? options.upperCase : false
    generateOptions.specialChars = generateOptions.hasOwnProperty('specialChars') ? options.specialChars : false
    var allowsChars = ((generateOptions.digits || '') && digits) +
        ((generateOptions.alphabets || '') && alphabets) +
        ((generateOptions.upperCase || '') && upperCase) +
        ((generateOptions.specialChars || '') && specialChars)
    var otp = ''
    for (var index = 0; index < length; ++index) {
        var charIndex = rand(0, allowsChars.length - 1)
        otp += allowsChars[charIndex]
    }
    return otp
};

exports.sendOtp = asyncHandler(async (req, res, next) => {
    let otp = await this.generate(4, {})
    let x = {
        mobileNumber: `${req.body.countryCode}${req.body.mobile}`,
        otp: 1234
    }
    console.log(x)
    //otp
    const _otp = await OTP.create(x);
    req.locals = { otp: _otp.otp }
    return next();
})


exports.createOtp = asyncHandler(async (req, res, next) => {
    let otp = await this.generate(4, {})
    let x = {
        mobileNumber: `${req.body.countryCode}${req.body.mobile}`,
        otp: otp
    }
    const _otp = await OTP.create(x);
    req.locals = { otp: _otp.otp }
    smsService.sendSMS(req.body.mobile, otp)
    return res.status(201).json(otp)
})


exports.verifyOtp = asyncHandler(async (req, res, next) => {
    var before5min = new Date();
    before5min.setTime(before5min.getTime() - (5 * 60 * 1000));
    console.log(before5min.toLocaleString())
    try {
        let data = await OTP.findOne({ mobileNumber: `${req.body.countryCode}${req.body.mobile}`, otp:req.body.otp })
        console.log(data)
        if (data && data.createdAt < before5min) {
            await OTP.findByIdAndUpdate(data.id, { isExpired:true }, { new: true });
            res.status(500);
            throw new Error(`OTP expired at ${data.createdAt.toLocaleString()}`)
        }
        else if (data && !data.isUsed) {
            await OTP.findByIdAndUpdate(data.id, { isUsed:true }, { new: true });
            return res.status(200).json({ success: true, verify: true })
        } else {
            throw new Error(`OTP already used`)
        }

    } catch (err) {
        console.log(err)
        throw new Error(err)
    }

})