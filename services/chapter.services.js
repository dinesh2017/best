const Chapter = require("../models/chapter.model");
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