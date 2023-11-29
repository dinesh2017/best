const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { omitBy, isNil } = require('lodash');

const splashScreenSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add the category name"]
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

splashScreenSchema.index({ name: 1 }, { unique: true });

splashScreenSchema.method({
    transform() {
        const transformed = {};
        const fields = ['id', 'name', 'image', 'createdBy', 'updatedBy', 'updatedAt', 'createdAt'];

        fields.forEach((field) => {
            transformed[field] = this[field];
        });

        return transformed;
    },
})

splashScreenSchema.statics = {
    /**
      * Get splashScreen Type
      *
      * @param {ObjectId} id - The objectId of CatesplashScreengory Type.
      * @returns {Promise<splashScreen, Error>}
      */
    async get(id) {
        try {
            let splashScreen;
            if (mongoose.Types.ObjectId.isValid(id)) {
                splashScreen = await this.findById(id).populate('createdBy updatedBy', 'name').exec();
            }
            if (splashScreen) {
                return splashScreen.transform();
            }
            throw new Error(
                'splashScreen does not exist',
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

        let splashScreens = await this.find(options).populate('createdBy updatedBy', 'name')
            .sort({ seqNumber: 1 })
            .skip(perPage * (page * 1 - 1))
            .limit(perPage * 1)
            .exec();
        splashScreens = splashScreens.map(splashScreen => splashScreen.transform())
        var count = await this.find(options).exec();
        count = count.length;
        var pages = Math.ceil(count / perPage);

        return { splashScreens, count, pages }

    },
}

module.exports = mongoose.model("splashScreen", splashScreenSchema);