const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add the category name"]
    },
    image: {
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
}, {
    timestamps: true
})

categorySchema.method({
    transform() {
       const transformed = {};
       const fields = ['id', 'name','image', 'createdBy','updatedBy','updatedAt','createdAt'];
 
       fields.forEach((field) => {
          transformed[field] = this[field];
       });
 
       return transformed;
    },
 })

module.exports = mongoose.model("Category", categorySchema);