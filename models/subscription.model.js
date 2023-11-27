const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subscriptionSchema = mongoose.Schema({
    name: {
        type: String,
    },
    duration: {
        type: Number,
    },
    price: {
        type: Number,
    },
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

module.exports = mongoose.model("Subscription", subscriptionSchema);