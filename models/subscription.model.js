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
        ref: "User"
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
}, {
    timestamps: true
})

subscriptionSchema.index({ name: 1 }, { unique: true });

subscriptionSchema.method({
    transform() {
        const transformed = {};
        const fields = ['id', 'name', 'duration', 'price', 'createdBy', 'updatedBy', 'updatedAt', 'createdAt'];

        fields.forEach((field) => {
            transformed[field] = this[field];
        });

        return transformed;
    },
})

subscriptionSchema.statics = {
    /**
      * Get Subscription Type
      *
      * @param {ObjectId} id - The objectId of CateSubscriptiongory Type.
      * @returns {Promise<subscription, Error>}
      */
    async get(id) {
        try {
            let subscription;
            if (mongoose.Types.ObjectId.isValid(id)) {
                subscription = await this.findById(id).populate('createdBy updatedBy', 'name').exec();
            }
            if (subscription) {
                return subscription.transform();
            }
            throw new Error(
                'Subscription does not exist',
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

        let subscriptions = await this.find(options).populate('createdBy updatedBy', 'name')
            .sort({ seqNumber: 1 })
            .skip(perPage * (page * 1 - 1))
            .limit(perPage * 1)
            .exec();
        subscriptions = subscriptions.map(subscription => subscription.transform())
        var count = await this.find(options).exec();
        count = count.length;
        var pages = Math.ceil(count / perPage);

        return { subscriptions, count, pages }

    },
}

module.exports = mongoose.model("Subscription", subscriptionSchema);