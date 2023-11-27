const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Gender = ["MALE", "FEMALE", "OTHER"]

const profileSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 128,
        index: true,
        trim: true
    },
    gender: { type: String, enum: Gender },
    dob: { type: Date },
    age: { type: Number },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    picture: {
        path: { type: String },
        name: { type: String }
    }
},
    {
        timestamps: true
    })

module.exports = mongoose.model("Profile", profileSchema);