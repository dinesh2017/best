const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Tags = require("./tags.model");
const { omitBy, isNil } = require('lodash');

const storySchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add the story name"]
    },
    description: {
        type: String,
    },
    age: {
        type: String,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category"
    },
    tags: [
        {
            type: Schema.Types.ObjectId,
            ref: "Tags"
        }
    ],
    chapters: [
        {
            type: Schema.Types.ObjectId,
            ref: "Chapter"
        }
    ],
    price: {
        type: Number,
    },
    image: {
        path: { type: String },
        name: { type: String }
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

storySchema.index({ name: 1 }, { unique: true });

storySchema.method({
    transform() {
        const transformed = {};
        const fields = ['id', 'name', 'description', 'age', 'price', 'image', 'category', 'tags', 'createdBy', 'updatedBy', 'updatedAt', 'createdAt'];

        fields.forEach((field) => {
            if (field == 'image')
                transformed[field] = this[field]?.path;
            else
                transformed[field] = this[field];
        });

        return transformed;
    },
})

storySchema.statics = {
    async get(id) {
        try {
            let story;
            if (mongoose.Types.ObjectId.isValid(id)) {
                story = await this.findById(id).populate('createdBy updatedBy category tags', 'name').exec();
            }
            if (story) {
                return story.transform();
            }
            throw new Error(
                'Story does not exist',
            );
        } catch (error) {
            throw new Error(error);
        }
    },
    async count(){
        try {
            var count = await this.find().exec();
            return count.length;
        } catch (error) {
            throw new Error(error);
        }
    },
    async list({ page = 1, perPage = 50, category, tags, search }) {
        let options = omitBy({ category }, isNil);
        if (search && search.length > 0) {
            let queryArr = []
            queryArr.push({ "name": { $regex: search, $options: 'i' } })
            options = { $and: [options, { $or: queryArr }] }
        }

        if (tags && tags.length > 0) {

            const tagObjects = await Tags.find({ name: { $in: tags } });

            const tagIds = tagObjects.map(tag => tag._id);

            options.tags = { $in: tagIds };
        }

        let story = await this.find(options).populate('createdBy updatedBy category tags', 'name')
            .sort({ seqNumber: 1 })
            .skip(perPage * (page * 1 - 1))
            .limit(perPage * 1)
            .exec();
        story = story.map(st => st.transform())
        var count = await this.find(options).exec();
        count = count.length;
        var pages = Math.ceil(count / perPage);

        return { story, count, pages }
    },
}


module.exports = mongoose.model("Story", storySchema);