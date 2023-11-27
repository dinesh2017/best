const asyncHandler = require("express-async-handler");
const Chapter = require("../models/chapter.model");


const getChapters = asyncHandler(async (req, res) => {
    const chapters = await Chapter.find()
    res.status(200).json(chapters);
})

const getChapter = asyncHandler(async (req, res) => {
    const chapter = await Chapter.findById(req.params.id);
    if(!chapter){
        res.status(404);
        throw new Error("Chapter not found")
    }
    res.status(200).json(chapter);
});

const createChapter = asyncHandler(async (req, res) => {
    const { name } = req.body;
    if (!name) {
        res.status(400)
        throw new Error("Chapter name is required");
    }
    const chapter = await Chapter.create({ name });
    res.status(201).json(chapter);
})

const updateChapter = asyncHandler(async (req, res) => {
    const chapter = await Chapter.findById(req.params.id);
    if(!chapter){
        res.status(404);
        throw new Error("Chapter not found")
    }
    const updatedChapter = await Chapter.findByIdAndUpdate(req.params.id, req.body, {new : true});
    res.status(200).json(updatedChapter);
})

const deleteChapter = asyncHandler(async (req, res) => {
    const chapter = await Chapter.findById(req.params.id);
    console.log(chapter)
    if(!chapter){
        res.status(404);
        throw new Error("Chapter not found")
    }
    await Chapter.remove();
    res.status(200).json(chapter);
})

module.exports = { getChapters, getChapter, createChapter, updateChapter, deleteChapter }