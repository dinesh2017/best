const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const coupanSchema = mongoose.Schema({
    name: {
        type: String,
    },
    discount: {
        type: Number,
    },
    expiry: {
        type: Date,
    },
    story: [{
        type: Schema.Types.ObjectId,
        ref: "Story"
    }],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "Admin"
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: "Admin"
    },
}, {
    timestamps: true
})

module.exports = mongoose.model("Coupan", coupanSchema);