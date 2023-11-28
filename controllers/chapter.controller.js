const asyncHandler = require("express-async-handler");
const Chapter = require("../models/chapter.model");


const getChapters = asyncHandler(async (req, res) => {
    try {
        const chapter = await Chapter.list(req.query);
        res.status(200).json(chapter);
    } catch (err) {
        res.status(500);
        throw new Error(err)
    }
})

const getChapter = asyncHandler(async (req, res) => {
    try {
        const chapter = await Chapter.get(req.params.id)
        if (!chapter) {
            res.status(404);
            throw new Error("Chapter not found")
        }
        res.status(200).json(chapter);
    } catch (err) {
        res.status(500);
        throw new Error(err)
    }
});

const createChapter = asyncHandler(async (req, res) => {
    try {
        const { name, description, subscription, story } = req.body;
        let { entity } = req.user
        let { audioFile } = req.local;
        if (!name) {
            res.status(400)
            throw new Error("All Fields required");
        }
        const chapter = await Chapter.create({ name, description, subscription, story, audioFile, createdBy: entity });
        res.status(201).json(chapter)
    } catch (err) {
        res.status(500);
        throw new Error(err)
    }
})

const updateChapter = asyncHandler(async (req, res) => {
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
        
        let _chapter = { name, description, subscription, audioFile, story, updatedBy: entity}
        
        const updatedStory = await Chapter.findByIdAndUpdate(req.params.id, _chapter, { new: true });
    res.status(200).json(updatedStory);
} catch (err) {
    res.status(500);
    throw new Error(err)
}
})

const deleteChapter = asyncHandler(async (req, res) => {
    const chapter = await Chapter.findById(req.params.id);
    if (!chapter) {
        res.status(404);
        throw new Error("Chapter not found")
    }
    await Chapter.remove();
    res.status(200).json(chapter);
})

module.exports = { getChapters, getChapter, createChapter, updateChapter, deleteChapter }