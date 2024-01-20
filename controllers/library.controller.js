const asyncHandler = require("express-async-handler");
const Library = require("../models/library.model");
const Chapter = require("../models/chapter.model");
const APIError = require('../utils/APIError');
const { getAudio } = require("../config/audioConfig");

const getLibraries = asyncHandler(async (req, res, next) => {
    try {
        let { entity } = req.user;
        req.query.user = entity;
        const { libraries, count, pages } = await Library.list(req.query);
        let modifiedLibrary = await Promise.all(libraries.map(async (x)=>{
            const chapter = await Chapter.get(x.chapter)
            x.audioFile = getAudio(chapter)
            const bookmark = await Library.findOne({ chapter: x.chapter, type: "BOOKMARK", user: entity });
            if (bookmark){
                x.BookMarkStatus = (bookmark.status) ? bookmark.status : false;
                x.time = (bookmark.time)?bookmark.time:"00:00:00";
                x.timeInSec = (bookmark.timeInSec)?bookmark.timeInSec:"0";
            }
            else{
                x.BookMarkStatus = false;
                x.time = "00:00:00";
                x.timeInSec = 0;
            }
            return x;    
        }));
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            libraries: modifiedLibrary,
            count, pages
        });
    } catch (error) {
        next(new APIError(error));
    }
})

const createLibrary = asyncHandler(async (req, res, next) => {
    try {
        const { story, chapter, time,timeInSec, timeInSecTotal, type, status } = req.body;
        let { entity } = req.user
        if (!story && !chapter) {
            next(new APIError({ message: "Please enter required fields", status: 400 }));
        }
        let library_ = null;
        // if(type == "FAVORITE"){
            
        // }else{
        //     library_ = await Library.findOne({chapter : chapter, user : entity, type : "BOOKMARK"});
        // }
        library_ = await Library.findOne({chapter : chapter, user : entity, type : type});
        
        if(library_){
            let _library;
            if(type == "BOOKMARK"){
                _library = { status, time, timeInSec }
            }else if(type == "RESUME"){
                _library = { status, time, timeInSec, timeInSecTotal }
            }else{
                _library = { status }
            }
            
            const library = await Library.findByIdAndUpdate(library_._id, _library, { new: true });
            res.status(200).json({
                status: 200,
                message: "SUCCESS",
                library: library,
            });
        }else{
            let lib;
            if(type == "BOOKMARK"){
                lib = { story, chapter, status, time, timeInSec, type, user: entity }
            }else if(type == "RESUME"){
                lib = { story, chapter,status, time, timeInSec, timeInSecTotal, type, user: entity }
            }else{
                lib = { story, chapter,status, type, user: entity }
            }
            const library = await Library.create(lib);
            res.status(200).json({
                status: 200,
                message: "SUCCESS",
                library: library,
            });
        }
        // }else{
        //     const library = await Library.create({ story, chapter, time, status, type, user: entity });
        //     res.status(200).json({
        //         status: 200,
        //         message: "SUCCESS",
        //         library: library,
        //     });
        // }
        
        
    } catch (error) {
        next(new APIError(error));
    }
})

const updateLibrary = asyncHandler(async (req, res, next) => {
    try {
        const library = await Library.findById(req.params.id);
        if (!library) {
            next(new APIError({ message: "Story not found", status: 401 }));
        }
        const { story, chapter, time, status, type } = req.body;
        let { entity } = req.user
        let _library = { story, chapter, time, status, type, user: entity }

        const updatedStory = await Library.findByIdAndUpdate(req.params.id, _library, { new: true });
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            library: updatedStory,
        });
    } catch (error) {
        next(new APIError(error));
    }
})

const deleteLibrary = asyncHandler(async (req, res, next) => {
    try {
        const library = await Library.findById(req.params.id);
        if (!library) {
            next(new APIError({ message: "Library not found", status: 200 }));
        }
        let _library = await Library.findByIdAndDelete(library.id)
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
        });
    } catch (error) {
        next(new APIError(error));
    }

})

module.exports = { getLibraries, createLibrary, updateLibrary, deleteLibrary }