const asyncHandler = require("express-async-handler");
const Tag = require("../models/tags.model");


const getTags = asyncHandler(async (req, res) => {
    try {
        const tags = await Tag.list(req.query);
        res.status(200).json(tags);
    } catch (err) {
        res.status(500);
        throw new Error(err)
    }
})

const getTag = asyncHandler(async (req, res) => {
    try {
        const tag = await Tag.get(req.params.id)
        if (!tag) {
            res.status(404);
            throw new Error("Tag not found")
        }
        res.status(200).json(tag);
    } catch (err) {
        res.status(500);
        throw new Error(err)
    }
});

const createTag = asyncHandler(async (req, res) => {
    try {
        const { name } = req.body;
        let { entity } = req.user

        if (!name) {
            res.status(400)
            throw new Error("Tag name is required");
        }
        const tag = await Tag.create({ name, createdBy: entity });
        res.status(201).json(tag)
    } catch (err) {
        res.status(500);
        throw new Error(err)
    }
})

const updateTag = asyncHandler(async (req, res) => {
    try {
        const { name } = req.body;
        let { entity } = req.user

        if (!name) {
            res.status(400)
            throw new Error("Tag name is required");
        }
        const tag = await Tag.findByIdAndUpdate(req.params.id, { name, updatedBy: entity }, { new: true });
        res.status(201).json(tag)
    } catch (err) {
        res.status(500);
        throw new Error(err)
    }
})

const deleteTag = asyncHandler(async (req, res) => {
    const tags = await Tag.findById(req.params.id);
    console.log(tags)
    if (!tags) {
        res.status(404);
        throw new Error("Tag not found")
    }
    await Tag.remove();
    res.status(200).json(tags);
})

module.exports = { getTags, getTag, createTag, updateTag, deleteTag }