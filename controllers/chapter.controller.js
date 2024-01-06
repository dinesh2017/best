const asyncHandler = require("express-async-handler");
const Chapter = require("../models/chapter.model");
const APIError = require('../utils/APIError');


const getChapters = asyncHandler(async (req, res, next) => {
    try {
        const { chapters, count, pages } = await Chapter.list(req.query);
        chapters.map((x) => {
            x.audioFile = req.protocol + "://" + req.get('host') + "/chapter/getaduio/" + x.id;

        })
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
        const { name, description, subscriptions, story } = req.body;
        let { entity } = req.user
        let { audioFile, image } = req.local;
        if (!name) {
            res.status(400)
            throw new Error("All Fields required");
        }
        // if (req.file) {
        //     const url = `/chapters/${req.file.filename}`;
        //     image = { path: url, name: req.file.filename }
        // }
        // ,
        const chapter = await Chapter.create({ name, description, subscriptions, audioFile, story, image, createdBy: entity });

        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            chapters: chapter.transform(),
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
        let _chapter = await Chapter.findByIdAndDelete(chapter.id)
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            chapters: _chapter,
        });
    } catch (error) {
        next(new APIError(error));
    }
})

module.exports = { getChapters, getChapter, createChapter, updateChapter, deleteChapter }