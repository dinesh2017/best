const Category = require("../models/category.model");
const Tag = require("../models/tags.model");
const Subscription = require("../models/subscription.model");
const asyncHandler = require("express-async-handler");
const APIError = require('../utils/APIError');

exports.getCategoryCombo = asyncHandler(async (req, res, next) => {
    try {
        const { categories } = await Category.combo()
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            categories: categories,
        });

    } catch (error) {
        next(new APIError(error));
    }
})

exports.getTagCombo = asyncHandler(async (req, res, next) => {
    try {
        const { tags } = await Tag.combo()
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            tags: tags,
        });

    } catch (error) {
        next(new APIError(error));
    }
})

exports.getSubscriptionCombo = asyncHandler(async (req, res, next) => {
    try {
        const { subscriptions } = await Subscription.combo()
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            subscriptions: subscriptions,
        });

    } catch (error) {
        next(new APIError(error));
    }
})