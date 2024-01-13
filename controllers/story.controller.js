const asyncHandler = require("express-async-handler");
const Story = require("../models/story.model");
const Chapter = require("../models/chapter.model");
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
        if(story.image)
            story.image = req.protocol + "://" + req.get('host')  + story.image;
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
        let agebetween = age.split("-");
        const story = await Story.create({ name, tags, description, category, ageFrom:agebetween[0], ageTo:agebetween[1], age, price, image, createdBy: entity });
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
        
        const { name, description, category, image, tags, age, price } = req.body;
        let _image = story.image;
        let { entity } = req.user
        if (req.file) {
            const url = `/story/${req.file.filename}`;
            _image = { path: url, name: req.file.filename }
        }
        let agebetween = age.split("-");
        let _story = { name, description, category, tags, ageFrom:agebetween[0], ageTo:agebetween[1], age, price, updatedBy: entity }

        if(image !== ""){
            _story.image = _image;
        }else{
            _story.$unset = { image: 1 };
        }
        const updatedStory = await Story.findByIdAndUpdate(req.params.id, _story, { new: true });

        const _updatedStory = await Story.get(updatedStory._id)
        if(_updatedStory && _updatedStory?.image){
            _updatedStory.image = req.protocol + "://" + req.get('host')  + _updatedStory.image;
        }
            
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            story: _updatedStory,
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
        await Chapter.deleteMany({ _id: { $in: story.chapters } });
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