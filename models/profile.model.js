const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { omitBy, isNil } = require('lodash');

const Gender = ["MALE", "FEMALE", "OTHER"]

const profileSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 128,
        index: true,
        trim: true
    },
    gender: { type: String, enum: Gender },
    dob: { type: Date },
    age: { type: Number },
    email: { type: String },
    activeProfile: {
        type: Boolean,
        default:false
    },
    picture: {
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
},
    {
        timestamps: true
    })
profileSchema.index({ name: 1 }, { unique: true });

profileSchema.method({
    transform() {
        const transformed = {};
        const fields = ['id', 'name', 'picture', 'gender', 'age', 'activeProfile', 'email', 'dob', 'createdBy', 'updatedBy', 'updatedAt', 'createdAt'];

        fields.forEach((field) => {
            if (field == 'image')
                transformed[field] = this[field]?.path;
            else
                transformed[field] = this[field];
        });

        return transformed;
    },
})
profileSchema.statics = {
    /**
      * Get Category Type
      *
      * @param {ObjectId} id - The objectId of Category Type.
      * @returns {Promise<User, APIError>}
      */
    async get(id) {
        try {
            let profile;
            if (mongoose.Types.ObjectId.isValid(id)) {
                profile = await this.findById(id).populate('createdBy updatedBy', 'name').exec();
            }
            if (profile) {
                return profile.transform();
            }
            throw new Error(
                'Profile does not exist',
            );
        } catch (error) {
            throw new Error(error);
        }
    },

    async list({ page = 1, perPage = 50, search, createdBy }) {
        let options = omitBy({ }, isNil);
        if (search && search.length > 0) {
            let queryArr = []
            queryArr.push({ "name": { $regex: search, $options: 'i' } })
            options = { $and: [options, { $or: queryArr }] }
        }
        options.$and = options.$and || [];
        options.$and.push({ "createdBy": createdBy });

        let profile = await this.find(options).populate('createdBy updatedBy', 'name')
            .sort({ seqNumber: 1 })
            .skip(perPage * (page * 1 - 1))
            .limit(perPage * 1)
            .exec();
        profile = profile.map(prof => prof.transform())
        var count = await this.find(options).exec();
        count = count.length;
        var pages = Math.ceil(count / perPage);

        return { profile, count, pages }

    },
}
module.exports = mongoose.model("Profile", profileSchema);