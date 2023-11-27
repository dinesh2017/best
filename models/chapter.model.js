const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chapterSchema = mongoose.Schema({
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    subscription: [{
        type: Schema.Types.ObjectId,
        ref: "Subscription"
    }],
    story: {
        type: Schema.Types.ObjectId,
        ref: "story"
    },
    audioFile: {
        path: { type: String },
        name: { type: String }
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "Admin"
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: "Admin"
    },
}, {
    timestamps: true
})

module.exports = mongoose.model("Chapter", chapterSchema);