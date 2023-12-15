const asyncHandler = require("express-async-handler");
const Chapter = require("../models/chapter.model");
const APIError = require('../utils/APIError');


const getChapters = asyncHandler(async (req, res, next) => {
    try {
        const { chapters, count, pages } = await Chapter.list(req.query);
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            chapters, count, pages
        });
    } catch (error) {
        next(new APIError(error));
    }
})

const getChapter = asyncHandler(async (req, res, next) => {
    try {
        const chapter = await Chapter.get(req.params.id)
        if (!chapter) {
            res.status(404);
            throw new Error("Chapter not found")
        }
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            chapters: chapter,
        });
    } catch (error) {
        next(new APIError(error));
    }
});

const createChapter = asyncHandler(async (req, res, next) => {
    try {
        const { name, description, subscription, story } = req.body;
        let { entity } = req.user
        let { audioFile } = req.local;
        let image = "";
        if (!name) {
            res.status(400)
            throw new Error("All Fields required");
        }
        if (req.file) {
            const url = `/chapters/${req.file.filename}`;
            image = { path: url, name: req.file.filename }
        }
        const chapter = await Chapter.create({ name, description, subscription, story,image, audioFile, createdBy: entity });
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            chapters: chapter,
        });
    } catch (error) {
        next(new APIError(error));
    }
})

const updateChapter = asyncHandler(async (req, res, next) => {
    try {
        const chapter = await Chapter.findById(req.params.id);
        if (!chapter) {
            res.status(404);
            throw new Error("Story not found")
        }
        const { name, description, subscription, story } = req.body;
        let { entity } = req.user
        let { audioPath } = req.local;
        let audioFile = ((audioPath) ? audioPath : chapter.audioFile);
        let image = chapter.image;
        if (req.file) {
            const url = `/chapters/${req.file.filename}`;
            image = { path: url, name: req.file.filename }
        }
        let _chapter = { name, description, subscription, audioFile, image, story, updatedBy: entity }

        const updatedStory = await Chapter.findByIdAndUpdate(req.params.id, _chapter, { new: true });
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            chapters: updatedStory,
        });
    } catch (error) {
        next(new APIError(error));
    }
})

const deleteChapter = asyncHandler(async (req, res, next) => {
    try {
        const chapter = await Chapter.findById(req.params.id);
        if (!chapter) {
            res.status(404);
            throw new Error("Chapter not found")
        }
        await Chapter.remove();
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
        });
    } catch (error) {
        next(new APIError(error));
    }
})

module.exports = { getChapters, getChapter, createChapter, updateChapter, deleteChapter }