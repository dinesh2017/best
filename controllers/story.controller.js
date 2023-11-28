const asyncHandler = require("express-async-handler");
const Story = require("../models/story.model");


const getStories = asyncHandler(async (req, res) => {
    try {
        const story = await Story.list(req.query);
        res.status(200).json(story);
    } catch (err) {
        res.status(500);
        throw new Error(err)
    }
})

const getStory = asyncHandler(async (req, res) => {
    try {
        const story = await Story.get(req.params.id)
        if (!story) {
            res.status(404);
            throw new Error("Story not found")
        }
        res.status(200).json(story);
    } catch (err) {
        res.status(500);
        throw new Error(err)
    }
});

const createStory = asyncHandler(async (req, res) => {
    try {
        const { name, description, tags, category, age, price } = req.body;
        let { entity } = req.user
        let image = "";
        if (!name) {
            res.status(400)
            throw new Error("All Fields required");
        }
        if (req.file) {
            const url = `/story/${req.file.filename}`;
            image = { path: url, name: req.file.filename }
        }
        const user = await Story.create({ name, tags, description, category, age, price, image, createdBy: entity });
        res.status(201).json(user)
    } catch (err) {
        res.status(500);
        throw new Error(err)
    }
})

const updateStory = asyncHandler(async (req, res) => {
    const story = await Story.findById(req.params.id);
    if (!story) {
        res.status(404);
        throw new Error("Story not found")
    }
    const { name, description, category, tags, age, price } = req.body;
    let { entity } = req.user
    if (req.file) {
        const url = `/story/${req.file.filename}`;
        image = { path: url, name: req.file.filename }
    }
    let _story = { name, description, category, tags, age, price, image, updatedBy: entity }
    const updatedStory = await Story.findByIdAndUpdate(req.params.id, _story, { new: true });
    res.status(200).json(updatedStory);
})

const deleteStory = asyncHandler(async (req, res) => {
    const story = await Story.findById(req.params.id);
    console.log(story)
    if (!story) {
        res.status(404);
        throw new Error("Story not found")
    }
    await Story.remove();
    res.status(200).json(story);
})

module.exports = { getStories, getStory, createStory, updateStory, deleteStory }