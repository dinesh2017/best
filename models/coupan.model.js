const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { omitBy, isNil } = require('lodash');

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
    subscription: [{
        type: Schema.Types.ObjectId,
        ref: "Subscription"
    }],
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

coupanSchema.index({ name: 1 }, { unique: true });

coupanSchema.method({
    transform() {
        const transformed = {};
        const fields = ['id', 'name', 'discount', 'expiry', 'story', 'createdBy', 'updatedBy', 'updatedAt', 'createdAt'];

        fields.forEach((field) => {
            transformed[field] = this[field];
        });

        return transformed;
    },
})

coupanSchema.statics = {
    /**
      * Get Subscription Type
      *
      * @param {ObjectId} id - The objectId of CateSubscriptiongory Type.
      * @returns {Promise<coupan, Error>}
      */
    async get(id) {
        try {
            let coupan;
            if (mongoose.Types.ObjectId.isValid(id)) {
                coupan = await this.findById(id).populate('createdBy updatedBy story subscription', 'name').exec();
            }
            if (coupan) {
                return coupan.transform();
            }
            throw new Error(
                'Coupan does not exist',
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

        let coupans = await this.find(options).populate('createdBy updatedBy story subscription', 'name')
            .sort({ seqNumber: 1 })
            .skip(perPage * (page * 1 - 1))
            .limit(perPage * 1)
            .exec();
        coupans = coupans.map(coupan => coupan.transform())
        var count = await this.find(options).exec();
        count = count.length;
        var pages = Math.ceil(count / perPage);

        return { coupans, count, pages }

    },
}

module.exports = mongoose.model("Coupan", coupanSchema);