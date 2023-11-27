const asyncHandler = require("express-async-handler");
const Story = require("../models/story.model");


const getStories = asyncHandler(async (req, res) => {
    const story = await Story.find()
    res.status(200).json(story);
})

const getStory = asyncHandler(async (req, res) => {
    const story = await Story.findById(req.params.id);
    if(!story){
        res.status(404);
        throw new Error("Story not found")
    }
    res.status(200).json(story);
});

const createStory = asyncHandler(async (req, res) => {
    const { name } = req.body;
    if (!name) {
        res.status(400)
        throw new Error("Story name is required");
    }
    const story = await Story.create({ name });
    res.status(201).json(story);
})

const updateStory = asyncHandler(async (req, res) => {
    const story = await Story.findById(req.params.id);
    if(!story){
        res.status(404);
        throw new Error("Story not found")
    }
    const updatedStory = await Story.findByIdAndUpdate(req.params.id, req.body, {new : true});
    res.status(200).json(updatedStory);
})

const deleteStory = asyncHandler(async (req, res) => {
    const story = await Story.findById(req.params.id);
    console.log(story)
    if(!story){
        res.status(404);
        throw new Error("Story not found")
    }
    await Story.remove();
    res.status(200).json(story);
})

module.exports = { getStories, getStory, createStory, updateStory, deleteStory }