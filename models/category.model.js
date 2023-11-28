const mongoose = require("mongoose");
const { omitBy, isNil } = require('lodash');

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add the category name"]
    },
    image: {
        path: { type: String },
        name: { type: String }
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
}, {
    timestamps: true
})

categorySchema.index({ name: 1 }, { unique: true });

categorySchema.method({
    transform() {
        const transformed = {};
        const fields = ['id', 'name', 'image', 'createdBy', 'updatedBy', 'updatedAt', 'createdAt'];

        fields.forEach((field) => {
            if(field == 'image')
                transformed[field] = this[field]?.path;
            else
                transformed[field] = this[field];
        });

        return transformed;
    },
})

categorySchema.statics = {
    /**
      * Get Category Type
      *
      * @param {ObjectId} id - The objectId of Category Type.
      * @returns {Promise<User, APIError>}
      */
    async get(id) {
        try {
            let category;
            if (mongoose.Types.ObjectId.isValid(id)) {
                category = await this.findById(id).populate('createdBy updatedBy', 'name').exec();
            }
            if (category) {
                return category.transform();
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

        let categorys = await this.find(options).populate('createdBy updatedBy', 'name')
            .sort({ seqNumber: 1 })
            .skip(perPage * (page * 1 - 1))
            .limit(perPage * 1)
            .exec();
        categorys = categorys.map(category => category.transform())
        var count = await this.find(options).exec();
        count = count.length;
        var pages = Math.ceil(count / perPage);

        return { categorys, count, pages }

    },
}

module.exports = mongoose.model("Category", categorySchema);