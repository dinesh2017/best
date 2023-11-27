const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const storySchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add the story name"]
    },
    description: {
        type: String,
    },
    Age: {
        type: String,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category"
    },
    tags: [{
        type: Schema.Types.ObjectId,
        ref: "Tags"
    }],
    price: {
        type: Number,
    },
    image: {
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

module.exports = mongoose.model("Story", storySchema);