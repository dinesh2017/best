const asyncHandler = require("express-async-handler");
const Chapter = require("../models/chapter.model");
const APIError = require('../utils/APIError');


const getChapters = asyncHandler(async (req, res, next) => {
    try {
        const { chapters, count, pages } = await Chapter.list(req.query);
        chapters.map((x) => {
            if(x.audioFile)
                x.audioFile = req.protocol + "://" + req.get('host') + "/chapter/getaduio/" + x.id;
            if(x.image.path !== undefined)
                x.image = req.protocol + "://" + req.get('host')  + x.image.path;
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
        let chapter = await Chapter.create({ name, description, subscriptions, audioFile, story, image, createdBy: entity });
        const _chapter = await Chapter.get(chapter._id)
        if(_chapter){
            _chapter.audioFile = req.protocol + "://" + req.get('host') + "/chapter/getaduio/" + chapter.id;
            _chapter.image = req.protocol + "://" + req.get('host')  + _chapter.image.path;
        }
            
        
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            chapters: _chapter,
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
            throw new Error("Chapter not found")
        }
        const { name, description, image:ImagePath, audioFile:AudioFile, subscriptions, story } = req.body;

        let { entity } = req.user
        let { audioFile, image } = req.local;
        let _chapter = { name, description, subscriptions, story, updatedBy: entity }

        if(audioFile){
            _chapter = {..._chapter, audioFile} 
        }
        if(image){
            _chapter = {..._chapter, image} 
        }
        
        if(ImagePath == "Remove"){
            _chapter.$unset = { image: 1 };
        }

        if(AudioFile == "Remove"){
            _chapter.$unset = { audioFile: 1 };
        }

        console.log(_chapter)
        
        const updatedStory = await Chapter.findByIdAndUpdate(req.params.id, _chapter, { new: true });
        const chapter_ = await Chapter.get(updatedStory._id);
        
        if(chapter_ && chapter_?.audioFile)
            chapter_.audioFile = req.protocol + "://" + req.get('host') + "/chapter/getaduio/" + chapter.id;

        if(chapter_.image.path)
            chapter_.image = req.protocol + "://" + req.get('host')  + chapter_.image.path;
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            chapters: chapter_,
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