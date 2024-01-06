
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { omitBy, isNil } = require('lodash');

const chapterSchema = mongoose.Schema({
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    subscriptions: [{
        type: Schema.Types.ObjectId,
        ref: "Subscription"
    }],
    story: {
        type: Schema.Types.ObjectId,
        ref: "Story"
    },
    image: {
        path: { type: String },
        name: { type: String }
    },
    audioFile: {
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

chapterSchema.index({ name: 1 });
chapterSchema.path('subscriptions').default(null);

chapterSchema.method({
    transform() {
        const transformed = {};
        const fields = ['id', 'name', 'description', 'subscriptions', 'story', 'audioFile', 'category', 'image', 'tags', 'createdBy', 'updatedBy', 'updatedAt', 'createdAt'];

        fields.forEach((field) => {
            // if (field == 'audioFile')
            //     transformed[field] = this[field]?.path;
            // else
            transformed[field] = this[field];
        });

        return transformed;
    },
})

chapterSchema.statics = {
    async get(id) {
        try {
            let chapter;
            if (mongoose.Types.ObjectId.isValid(id)) {
                chapter = await this.findById(id).populate('createdBy updatedBy story subscriptions', 'name image').exec();
            }
            if (chapter) {
                return chapter.transform();
            }
            throw new Error(
                'Chapter does not exist',
            );
        } catch (error) {
            throw new Error(error);
        }
    },

    async list({ page = 1, perPage = 50, story, search }) {
        let options = omitBy({ story }, isNil);

        if (search && search.length > 0) {
            let queryArr = []
            queryArr.push({ "name": { $regex: search, $options: 'i' } })
            options = { $and: [options, { $or: queryArr }] }
        }

        let chapters = await this.find(options).populate('createdBy updatedBy story subscriptions', 'name image')
            .sort({ seqNumber: 1 })
            .skip(perPage * (page * 1 - 1))
            .limit(perPage * 1)
            .exec();
        chapters = chapters.map(chapter => chapter.transform())
        var count = await this.find(options).exec();
        count = count.length;
        var pages = Math.ceil(count / perPage);

        return { chapters, count, pages }

    },
}

module.exports = mongoose.model("Chapter", chapterSchema);