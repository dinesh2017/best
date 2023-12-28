const Chapter = require("../models/chapter.model");
const Library = require("../models/library.model");
const asyncHandler = require("express-async-handler");
const APIError = require('../utils/APIError');

exports.getChaptersByStory = asyncHandler(async (req, res, next) => {
    try {
        let { storyId } = req.params
        req.query.story = storyId
        const { chapters, count, pages } = await Chapter.list(req.query);
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            chapters: chapters,
            count, pages
        });

    } catch (error) {
        next(new APIError(error));
    }
})

exports.getChatpterById = asyncHandler(async (req, res, next) => {
    try {
        const chapter = await Chapter.get(req.params.id)
        if (!chapter) {
            res.status(404);
            throw new Error("Chapter not found")
        }
        let { entity } = req.user;
        const library = await Library.findOne({chapter:chapter.id, type:"FAVORITE", user:entity});
        const subscription = { ...chapter };
        if(library)
            subscription.status = (library.status)?library.status:false;
        else
            subscription.status = false;
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            chapter: subscription,
        });

    } catch (error) {
        next(new APIError(error));
    }
})