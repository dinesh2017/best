const mongoose = require("mongoose");
const { omitBy, isNil } = require('lodash');

const slidesSchema = mongoose.Schema({
    description: {
        type: String,
    },
    image: {
        path: { type: String },
        name: { type: String }
    },
    title: {
        type: String,
    },
    action: {
        type: String,
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

slidesSchema.index({ title: 1 }, { unique: true });

slidesSchema.method({
    transform() {
        const transformed = {};
        const fields = ['id', 'title', 'description', 'image','action','createdBy', 'updatedBy', 'updatedAt', 'createdAt'];

        fields.forEach((field) => {
            if (field == 'image')
                transformed[field] = this[field]?.path;
            else
                transformed[field] = this[field];
        });

        return transformed;
    },
})

slidesSchema.statics = {
    /**
      * Get Category Type
      *
      * @param {ObjectId} id - The objectId of Category Type.
      * @returns {Promise<User, APIError>}
      */
    async get(id) {
        try {
            let slide;
            if (mongoose.Types.ObjectId.isValid(id)) {
                slide = await this.findById(id).populate('createdBy updatedBy', 'name').exec();
            }
            if (slide) {
                return slide.transform();
            }
            throw new Error(
                'Slides Data does not exist',
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

        let slides = await this.find(options).populate('createdBy updatedBy', 'name')
            .sort({ seqNumber: 1 })
            .skip(perPage * (page * 1 - 1))
            .limit(perPage * 1)
            .exec();
            slides = slides.map(slide => slide.transform())
        var count = await this.find(options).exec();
        count = count.length;
        var pages = Math.ceil(count / perPage);

        return { slides, count, pages }

    },
}

module.exports = mongoose.model("Slides", slidesSchema);