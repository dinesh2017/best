const mongoose = require("mongoose");
const { omitBy, isNil } = require('lodash');

const homeSchema = mongoose.Schema({
    videoUrl: {
        type: String,
    },
    popupImage: {
        path: { type: String },
        name: { type: String }
    },
    StoryTypes: [
        { type: String }
    ],
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

homeSchema.index({ name: 1 }, { unique: true });

homeSchema.method({
    transform() {
        const transformed = {};
        const fields = ['id', 'popupImage', 'videoUrl', 'StoryTypes','createdBy', 'updatedBy', 'updatedAt', 'createdAt'];

        fields.forEach((field) => {
            if (field == 'image')
                transformed[field] = this[field]?.path;
            else
                transformed[field] = this[field];
        });

        return transformed;
    },
})

homeSchema.statics = {
    /**
      * Get Category Type
      *
      * @param {ObjectId} id - The objectId of Category Type.
      * @returns {Promise<User, APIError>}
      */
    async get(id) {
        try {
            let home;
            if (mongoose.Types.ObjectId.isValid(id)) {
                home = await this.findById(id).populate('createdBy updatedBy', 'name').exec();
            }
            if (home) {
                return home.transform();
            }
            throw new Error(
                'Home Data does not exist',
            );
        } catch (error) {
            throw new Error(error);
        }
    }
}

module.exports = mongoose.model("Home", homeSchema);