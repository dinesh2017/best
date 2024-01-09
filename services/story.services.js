const Story = require("../models/story.model");
const Chapter = require("../models/chapter.model");
const asyncHandler = require("express-async-handler");
const APIError = require('../utils/APIError');
const Tags = require("../models/tags.model");
const { omitBy, isNil } = require('lodash');

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
exports.GetStoriesWithChapters = asyncHandler(async (req, res, next) => {
    try {
        let { page = 1, perPage = 50, category, tags, search } = req.query;
        let options = omitBy({ category }, isNil);
        if (search && search.length > 0) {
            let queryArr = []
            queryArr.push({ "name": { $regex: search, $options: 'i' } })
            options = { $and: [options, { $or: queryArr }] }
        }
        if (tags && tags.length > 0) {
            const tagObjects = await Tags.find({ name: { $in: tags } });
            const tagIds = tagObjects.map(tag => tag._id);
            options.tags = { $in: tagIds };
        }
        
        let story = await Story.find(options)
        .populate({
            path: 'chapters',
            select: 'name audioFile subscriptions',
            populate: {
              path: 'subscriptions',
              select: 'name',
            }
          })
        .populate('createdBy updatedBy category tags', 'name')
            .sort({ seqNumber: 1 })
            .skip(perPage * (page * 1 - 1))
            .limit(perPage * 1)
            .exec();
        // story = story.map(st => st.transform())
        var count = await Story.find(options).exec();
        count = count.length;
        var pages = Math.ceil(count / perPage);
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