const Story = require("../models/story.model");
const asyncHandler = require("express-async-handler");
const APIError = require('../utils/APIError');

exports.getStoriesByCategory = asyncHandler(async (req, res, next) => {
    try {
        let { categoryId } = req.params
        req.query.category = categoryId
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
});