const mongoose = require("mongoose");

const tagsSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add the tags name"]
    },
    image: {
        path: { type: String },
        name: { type: String }
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Tags", tagsSchema);