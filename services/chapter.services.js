const Chapter = require("../models/chapter.model");
const asyncHandler = require("express-async-handler");

exports.getChaptersByStory = asyncHandler(async (req, res, next) => {
    try {
        let { storyId } = req.params
        req.query.story = storyId
        const chapters = await Chapter.list(req.query);
        res.status(200).json(chapters);
    } catch (err) {
        res.status(500)
        throw new Error(err)
    }
})