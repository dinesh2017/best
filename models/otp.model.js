const mongoose = require("mongoose")
const Schema = mongoose.Schema

var otpShema = new Schema(
    {
        otp: {type:String,trim:true},
        mobileNumber: { type: String, trim: true },
        email:{type:String,trim:true},
        isUsed:{type:Boolean,default:false},
        isExpired: { type: Boolean, default: false }
    },
    { timestamps: true }
)


module.exports = mongoose.model("otp", otpShema)