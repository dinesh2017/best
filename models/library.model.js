const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { omitBy, isNil } = require('lodash');

const librarySchema = mongoose.Schema({
    story: {
        type: Schema.Types.ObjectId,
        ref: "Story"
    },
    chapter: {
        type: Schema.Types.ObjectId,
        ref: "Chapter"
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    time: {
        type: String,
    },
    type: {
        type: String,
    },
}, {
    timestamps: true
});

librarySchema.path('chapter').default(null);

librarySchema.method({
    transform() {
        const transformed = {};
        const fields = ['id', 'subscription', 'user', 'chapter', 'time', 'type', 'updatedAt', 'createdAt'];

        fields.forEach((field) => {
            transformed[field] = this[field];
        });

        return transformed;
    },
})

librarySchema.statics = {
    /**
      * Get Category Type
      *
      * @param {ObjectId} id - The objectId of Category Type.
      * @returns {Promise<User, APIError>}
      */
    async get(id) {
        try {
            let library;
            if (mongoose.Types.ObjectId.isValid(id)) {
                library = await this.findById(id).populate('story user chapter', 'name').exec();
            }
            if (library) {
                return library.transform();
            }
            throw new Error(
                'Liberary does not exist',
            );
        } catch (error) {
            throw new Error(error);
        }
    },

    async list({ page = 1, perPage = 50, search }) {
        let options = omitBy({}, isNil);
        if (search && search.length > 0) {
            let queryArr = []
            queryArr.push({ "type": { $regex: search, $options: 'i' } })
            options = { $and: [options, { $or: queryArr }] }
        }

        let libraries = await this.find(options).populate('story chapter user', 'name')
            .sort({ seqNumber: 1 })
            .skip(perPage * (page * 1 - 1))
            .limit(perPage * 1)
            .exec();
        libraries = libraries.map(lib => lib.transform())
        var count = await this.find(options).exec();
        count = count.length;
        var pages = Math.ceil(count / perPage);

        return { libraries, count, pages }

    },
}

module.exports = mongoose.model("Library", librarySchema);