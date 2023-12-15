const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { omitBy, isNil } = require('lodash');

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
    expiryDate: {
        type: Date,
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

subscriberSchema.method({
    transform() {
        const transformed = {};
        const fields = ['id', 'orderId', 'subscription', 'user', 'coupan', 'price', 'discount','total','orderDate','paymentStatus', 'createdBy', 'updatedBy', 'updatedAt', 'createdAt'];

        fields.forEach((field) => {
            transformed[field] = this[field];
        });

        return transformed;
    },
})


subscriberSchema.statics = {
    /**
      * Get Category Type
      *
      * @param {ObjectId} id - The objectId of Category Type.
      * @returns {Promise<User, APIError>}
      */
    async get(id) {
        try {
            let subscribe;
            if (mongoose.Types.ObjectId.isValid(id)) {
                subscribe = await this.findById(id).populate('subscription user coupan createdBy updatedBy', 'name').exec();
            }
            if (subscribe) {
                return subscribe.transform();
            }
            throw new Error(
                'Category does not exist',
            );
        } catch (error) {
            throw new Error(error);
        }
    },

    async list({ page = 1, perPage = 50, search }) {
        let options = omitBy({}, isNil);
        if (search && search.length > 0) {
            let queryArr = []
            queryArr.push({ "name": { $regex: search, $options: 'i' } })
            options = { $and: [options, { $or: queryArr }] }
        }

        let subscribers = await this.find(options).populate('subscription user coupan createdBy updatedBy', 'name')
            .sort({ seqNumber: 1 })
            .skip(perPage * (page * 1 - 1))
            .limit(perPage * 1)
            .exec();
            subscribers = subscribers.map(subscribe => subscribe.transform())
        var count = await this.find(options).exec();
        count = count.length;
        var pages = Math.ceil(count / perPage);

        return { subscribers, count, pages }

    },
}

module.exports = mongoose.model("Subscriber", subscriberSchema);