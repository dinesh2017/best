const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subscriberSchema = mongoose.Schema({
    orderId: {
        type: String,
    },
    subscription: {
        type: Schema.Types.ObjectId,
        ref: "Subscription"
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    coupan: {
        type: Schema.Types.ObjectId,
        ref: "Coupan"
    },
    price: {
        type: Number,
    },
    discount: {
        type: Number,
    },
    total: {
        type: Number,
    },
    orderDate: {
        type: Date,
    },
    paymentStatus: {
        type: String,
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

module.exports = mongoose.model("Subscriber", subscriberSchema);