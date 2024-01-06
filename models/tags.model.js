const mongoose = require("mongoose");
const { omitBy, isNil } = require('lodash');

const tagsSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add the tags name"]
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

tagsSchema.index({ name: 1 }, { unique: true });

tagsSchema.method({
    transform() {
        const transformed = {};
        const fields = ['id', 'name', 'createdBy', 'updatedBy', 'updatedAt', 'createdAt'];

        fields.forEach((field) => {
            transformed[field] = this[field];
        });

        return transformed;
    },
})

tagsSchema.statics = {
    /**
      * Get tags Type
      *
      * @param {ObjectId} id - The objectId of tags Type.
      * @returns {Promise<User, APIError>}
      */
    async get(id) {
        try {
            let tags;
            if (mongoose.Types.ObjectId.isValid(id)) {
                tags = await this.findById(id).populate('createdBy updatedBy', 'name').exec();
            }
            if (tags) {
                return tags.transform();
            }
            throw new Error(
                'tags does not exist',
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

        let tags = await this.find(options).populate('createdBy updatedBy', 'name')
            .sort({ seqNumber: 1 })
            .skip(perPage * (page * 1 - 1))
            .limit(perPage * 1)
            .exec();
        tags = tags.map(tags => tags.transform())
        var count = await this.find(options).exec();
        count = count.length;
        var pages = Math.ceil(count / perPage);

        return { tags, count, pages }

    },

    async combo() {
        let tags = await this.find().select("id name").exec();
        tags = tags.map(x => {return {label: x.name, value : x._id}});
        return { tags }

    },
}

module.exports = mongoose.model("Tags", tagsSchema);