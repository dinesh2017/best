const Subscriber = require("../models/subscriber.model");
const asyncHandler = require("express-async-handler");
const APIError = require('../utils/APIError');
const { omitBy, isNil } = require('lodash');

exports.getSubscribers = asyncHandler(async (req, res, next) => {
    try {
        const { story, count, pages } = await Subscriber.list(req.query);
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