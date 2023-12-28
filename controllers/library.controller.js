const asyncHandler = require("express-async-handler");
const Library = require("../models/library.model");
const Chapter = require("../models/chapter.model");
const APIError = require('../utils/APIError');

const getLibraries = asyncHandler(async (req, res, next) => {
    try {
        let { entity } = req.user;
        req.query.user = entity;
        const { libraries, count, pages } = await Library.list(req.query);
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            libraries: libraries,
            count, pages
        });
    } catch (error) {
        next(new APIError(error));
    }
})

const createLibrary = asyncHandler(async (req, res, next) => {
    try {
        const { story, chapter, time, type, status } = req.body;
        let { entity } = req.user
        if (!story && !chapter) {
            next(new APIError({ message: "Please enter required fields", status: 400 }));
        }
        if(type == "FAVORITE"){
            const library_ = await Library.findOne({chapter : chapter, user : entity, type : "FAVORITE"});
            if(library_){
                let _library = { status }
                const library = await Library.findByIdAndUpdate(library_._id, _library, { new: true });
                res.status(200).json({
                    status: 200,
                    message: "SUCCESS",
                    library: library,
                });
            }else{
                const library = await Library.create({ story, chapter, time, status, type, user: entity });
                res.status(200).json({
                    status: 200,
                    message: "SUCCESS",
                    library: library,
                });
            }
        }else{
            const library = await Library.create({ story, chapter, time, status, type, user: entity });
            res.status(200).json({
                status: 200,
                message: "SUCCESS",
                library: library,
            });
        }
        
        
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