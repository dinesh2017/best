const asyncHandler = require("express-async-handler");
const Home = require("../models/home.model");
const APIError = require('../utils/APIError');

const getHome = asyncHandler(async (req, res, next) => {
    try {
        const home = await Home.findOne();
        if (!home) {
            next(new APIError({ message: "Home not found", status: 200 }));
        }
        let modifiedHome = {}
        if (home) {
            if(home.videoUrl.path !== undefined){
                modifiedHome = {
                    ...modifiedHome,
                    videoUrl: req.protocol + "://" + req.get('host') + "/home/getvideo/" + home.videoUrl.name,
                    videoEnabled: home.videoUrl.isEnable,
                    
                };
            }

            console.log(home.popupImage)
            if(home.popupImage.path !== undefined){
                modifiedHome = {
                    ...modifiedHome,
                    popupImage: req.protocol + "://" + req.get('host')  + home.popupImage.path,
                    popupEnabled: home.popupImage.isEnable
                };
            }
            
        }
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            home: modifiedHome,
        });
    } catch (error) {
        next(new APIError(error));
    }
})

const createOrUpdateVideo = asyncHandler(async (req, res, next) => {
    const findHome = await Home.findOne();
    let { videoFile } = req.local;
    let valuesToUpdate = {};
    let { entity } = req.user
    if (videoFile) {
        let { path, name } = videoFile;
        valuesToUpdate = { videoUrl: { path, name, isEnable: true }, createdBy: entity, updatedBy: entity }
    }
    else
        valuesToUpdate.$unset = { videoUrl: 1 };

    if (!findHome) {
        const createHome = await Home.create(valuesToUpdate);
    } else {
        const updateHome = await Home.findByIdAndUpdate(findHome.id, valuesToUpdate, { new: true });
       
    }
    const home = await Home.findOne();
    let modifiedHome = {}
    if (home) {
        if(home.videoUrl.path !== undefined){
            modifiedHome = {
                ...modifiedHome,
                videoUrl: req.protocol + "://" + req.get('host') + "/home/getvideo/" + home.videoUrl.name,
                videoEnabled: home.videoUrl.isEnable,
                
            };
        }

        console.log(home.popupImage)
        if(home.popupImage.path !== undefined){
            modifiedHome = {
                ...modifiedHome,
                popupImage: req.protocol + "://" + req.get('host')  + home.popupImage.path,
                popupEnabled: home.popupImage.isEnable
            };
        }
    }
    res.status(200).json({
        status: 200,
        home: modifiedHome,
        message: "SUCCESS",
    });
});

const createOrUpdateImage = asyncHandler(async (req, res, next) => {
    const findHome = await Home.findOne();
    let { image } = req.local;
    let valuesToUpdate = {};
    let { entity } = req.user
    if (image) {
        let { path, name } = image;
        valuesToUpdate = { popupImage: { path, name, isEnable: true }, createdBy: entity, updatedBy: entity }
    }
    else
        valuesToUpdate.$unset = { popupImage: 1 };

    if (!findHome) {
        const createHome = await Home.create(valuesToUpdate);
        res.status(200).json({
            status: 200,
            home: createHome,
            message: "SUCCESS",
        });
    } else {
        const updateHome = await Home.findByIdAndUpdate(findHome.id, valuesToUpdate, { new: true });
        res.status(200).json({
            status: 200,
            home: updateHome,
            message: "SUCCESS",
        });
    }
});


const createHome = asyncHandler(async (req, res, next) => {
    try {
        const { videoUrl, StoryTypes } = req.body;
        let { entity } = req.user
        let image = "";
        if (req.file) {
            const url = `/home/${req.file.filename}`;
            image = { path: url, name: req.file.filename }
        }
        const home = await Home.create({ videoUrl, popupImage: image, StoryTypes, createdBy: entity });
        res.status(200).json({
            status: 200,
            home: home,
            message: "SUCCESS",
        });
    } catch (error) {
        next(new APIError(error));
    }

})

const updateHome = asyncHandler(async (req, res, next) => {
    try {
        const { videoUrl, StoryTypes } = req.body;
        let { entity } = req.user
        let image = "";
        if (req.file) {
            const url = `/home/${req.file.filename}`;
            image = { path: url, name: req.file.filename }
        }
        const home = await Home.findByIdAndUpdate(req.params.id, { videoUrl, popupImage: image, StoryTypes, createdBy: entity }, { new: true });
        res.status(200).json({
            status: 200,
            home: home,
            message: "SUCCESS",
        });
    } catch (error) {
        next(new APIError(error));
    }

})

module.exports = { updateHome, createHome, getHome, createOrUpdateVideo,createOrUpdateImage }