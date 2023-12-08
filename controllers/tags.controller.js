const asyncHandler = require("express-async-handler");
const Tag = require("../models/tags.model");
const APIError = require('../utils/APIError');

const getTags = asyncHandler(async (req, res,next) => {
    try {
        const { tags, count, pages } = await Tag.list(req.query);
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            tags: tags,
            count, pages
        });
    } catch (error) {
        next(new APIError(error));
    }
})

const getTag = asyncHandler(async (req, res, next) => {
    try {
        const tag = await Tag.get(req.params.id)
        if (!tag) {
            next(new APIError({ message: "Tag not found", status: 200 }));
        }
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            tag: tag,
        });
    } catch (error) {
        next(new APIError(error));
    }
});

const createTag = asyncHandler(async (req, res, next) => {
    try {
        const { name } = req.body;
        let { entity } = req.user

        if (!name) {
            next(new APIError({ message: "Tag not found", status: 200 }));
        }
        const tag = await Tag.create({ name, createdBy: entity });
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            tag: tag
        });
    } catch (error) {
        next(new APIError(error));
    }
})

const updateTag = asyncHandler(async (req, res, next) => {
    try {
        const { name } = req.body;
        let { entity } = req.user

        if (!name) {
            next(new APIError({ message: "Tag not found", status: 200 }));
        }
        const tag = await Tag.findByIdAndUpdate(req.params.id, { name, updatedBy: entity }, { new: true });
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            tag: tag,
        });
    } catch (error) {
        next(new APIError(error));
    }
})

const deleteTag = asyncHandler(async (req, res, next) => {
    try {
        const tags = await Tag.findById(req.params.id);
        if (!tags) {
            next(new APIError({ message: "Tag not found", status: 200 }));
        }
        let _tag = await Tag.findByIdAndDelete(tags.id)
        res.status(200).json({
            status: 200,
            tag: _tag,
            message: "SUCCESS",
        });
    } catch (error) {
        next(new APIError(error));
    }
})

module.exports = { getTags, getTag, createTag, updateTag, deleteTag }