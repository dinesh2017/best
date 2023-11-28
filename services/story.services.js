const Story = require("../models/story.model");
const asyncHandler = require("express-async-handler");

exports.getStoriesByCategory = asyncHandler(async (req, res, next) => {
    try {
        let { categoryId } = req.params
        req.query.category = categoryId
        const stories = await Story.list(req.query);
        res.status(200).json(stories);
    } catch (err) {
        res.status(500)
        throw new Error(err)
    }
})