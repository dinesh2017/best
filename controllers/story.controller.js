const asyncHandler = require("express-async-handler");
const Story = require("../models/story.model");
const APIError = require('../utils/APIError');


const getStories = asyncHandler(async (req, res, next) => {
    try {
        const { story, count, pages } = await Story.list(req.query);
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            stories: story,
            count, pages
        });
    } catch (error) {
        next(new APIError(error));
    }
})

const getStory = asyncHandler(async (req, res, next) => {
    try {
        const story = await Story.get(req.params.id)
        if (!story) {
            console.log("heelow")
            next(new APIError({message:"Test",status : 200}));
        }
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            story: story,
        });
    } catch (error) {
        next(new APIError(error));
    }
});

const createStory = asyncHandler(async (req, res, next) => {
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
        const story = await Story.create({ name, tags, description, category, age, price, image, createdBy: entity });
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            story: story,
        });
    } catch (error) {
        next(new APIError(error));
    }
})

const updateStory = asyncHandler(async (req, res, next) => {
    try {
        const story = await Story.findById(req.params.id);
        if (!story) {
            res.status(404);
            throw new Error("Story not found")
        }
        let image = story.image;
        const { name, description, category, tags, age, price } = req.body;
        let { entity } = req.user
        if (req.file) {
            const url = `/story/${req.file.filename}`;
            image = { path: url, name: req.file.filename }
        }
        let _story = { name, description, category, tags, age, price, image, updatedBy: entity }
        const updatedStory = await Story.findByIdAndUpdate(req.params.id, _story, { new: true });
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            story: updatedStory,
        });
    } catch (error) {
        next(new APIError(error));
    }
})

const deleteStory = asyncHandler(async (req, res, next) => {
    try {
        const story = await Story.findById(req.params.id);
        console.log(story)
        if (!story) {
            res.status(404);
            throw new Error("Story not found")
        }
        let _story = await Story.findByIdAndDelete(story.id)
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            story:_story
        });
    } catch (error) {
        next(new APIError(error));
    }
})

module.exports = { getStories, getStory, createStory, updateStory, deleteStory }