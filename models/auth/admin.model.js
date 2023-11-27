const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
    email: {
        type: String,
        match : /^\S+@\S+\.\S$/,
        unique : true,
        trim : true,
        lowercase:true,
        required: [true, "Please add the email"]
    },
    password : {
        type : String,
        required : true,
        minlength : 6,
        maxlength : 128
    },
    name : {
        type : String,
        required : true,
        maxlength : 128,
        index : true,
        trim : true
    },
    picture: {
        path: { type: String },
        name: { type: String }
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Admin", adminSchema);