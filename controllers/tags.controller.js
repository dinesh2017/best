const asyncHandler = require("express-async-handler");
const Tag = require("../models/tags.model");


const getTags = asyncHandler(async (req, res) => {
    const tags = await Tag.find()
    res.status(200).json(tags);
})

const getTag = asyncHandler(async (req, res) => {
    const tags = await Tag.findById(req.params.id);
    if(!tags){
        res.status(404);
        throw new Error("Tag not found")
    }
    res.status(200).json(tags);
});

const createTag = asyncHandler(async (req, res) => {
    const { name } = req.body;
    if (!name) {
        res.status(400)
        throw new Error("Tag name is required");
    }
    const tags = await Tag.create({ name });
    res.status(201).json(tags);
})

const updateTag = asyncHandler(async (req, res) => {
    const tags = await Tag.findById(req.params.id);
    if(!tags){
        res.status(404);
        throw new Error("Tag not found")
    }
    const updatedTag = await Tag.findByIdAndUpdate(req.params.id, req.body, {new : true});
    res.status(200).json(updatedTag);
})

const deleteTag = asyncHandler(async (req, res) => {
    const tags = await Tag.findById(req.params.id);
    console.log(tags)
    if(!tags){
        res.status(404);
        throw new Error("Tag not found")
    }
    await Tag.remove();
    res.status(200).json(tags);
})

module.exports = { getTags, getTag, createTag, updateTag, deleteTag }