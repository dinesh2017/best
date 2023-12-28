const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { omitBy, isNil } = require('lodash');

const  notificationSchema = mongoose.Schema({
    title: {
        type: String,
    },
    msg: {
        type: String,
    },
    type: {
        type: String,
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
});

 notificationSchema.method({
    transform() {
        const transformed = {};
        //, 'updatedAt', 'user', 'createdAt''user', 
        const fields = ['id', 'title', 'type',"msg"];

        fields.forEach((field) => {
            transformed[field] = this[field];
        });

        return transformed;
    },
})

 notificationSchema.statics = {
    /**
      * Get Category Type
      *
      * @param {ObjectId} id - The objectId of Category Type.
      * @returns {Promise<User, APIError>}
      */
    async get(id) {
        try {
            let  notification;
            //user 
            if (mongoose.Types.ObjectId.isValid(id)) {
                 notification = await this.findById(id).exec();
            }
            if ( notification) {
                return  notification.transform();
            }
            throw new Error(
                'Liberary does not exist',
            );
        } catch (error) {
            throw new Error(error);
        }
    },

    async list({ page = 1, perPage = 50, search, user }) {
        let options = omitBy({}, isNil);
        if (search && search.length > 0) {
            let queryArr = []
            queryArr.push({ "type": { $regex: search, $options: 'i' } });
            options.$and = [{ $or: queryArr }];
        }
        options.$and = options.$and || [];
        options.$and.push({ "user": user });
        let notification = await this.find(options)
            .sort({ seqNumber: 1 })
            .skip(perPage * (page * 1 - 1))
            .limit(perPage * 1)
            .exec();
        notification = notification.map(lib => lib.transform())
        var count = await this.find(options).exec();
        count = count.length;
        var pages = Math.ceil(count / perPage);

        return { notification, count, pages }

    },
}

module.exports = mongoose.model("Notification",  notificationSchema);