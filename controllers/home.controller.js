const asyncHandler = require("express-async-handler");
const Home = require("../models/home.model");
const APIError = require('../utils/APIError');

const getHomeData = async (req) => {
    const home = await Home.findOne();
    let modifiedHome = {}
    if (home) {
        if (home.videoUrl.path !== undefined) {
            modifiedHome = {
                ...modifiedHome,
                videoUrl: req.protocol + "://" + req.get('host') + "/home/getvideo/" + home.videoUrl.name,
                videoEnabled: home.videoUrl.isEnable,

            };
        }
        if (home.popupImage.path !== undefined) {
            modifiedHome = {
                ...modifiedHome,
                popupImage: req.protocol + "://" + req.get('host') + home.popupImage.path,
                popupEnabled: home.popupImage.isEnable
            };
        }
        if (home.videoImage.path !== undefined) {
            modifiedHome = {
                ...modifiedHome,
                videoImage: req.protocol + "://" + req.get('host') + home.videoImage.path,
            };
        }
        modifiedHome = {
            ...modifiedHome,
            StoryTypes:home.StoryTypes
        }
    }
    return modifiedHome;
}

const getHome = asyncHandler(async (req, res, next) => {
    try {
        // const home = await Home.findOne();
        // if (!home) {
        //     next(new APIError({ message: "Home not found", status: 200 }));
        // }
        const home = await getHomeData(req)
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            home
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
        if (home.videoUrl.path !== undefined) {
            modifiedHome = {
                ...modifiedHome,
                videoUrl: req.protocol + "://" + req.get('host') + "/home/getvideo/" + home.videoUrl.name,
                videoEnabled: home.videoUrl.isEnable,

            };
        }
        if (home.popupImage.path !== undefined) {
            modifiedHome = {
                ...modifiedHome,
                popupImage: req.protocol + "://" + req.get('host') + home.popupImage.path,
                popupEnabled: home.popupImage.isEnable
            };
        }
        if (home.videoImage.path !== undefined) {
            modifiedHome = {
                ...modifiedHome,
                videoImage: req.protocol + "://" + req.get('host') + home.videoImage.path,
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
    } else {
        const updateHome = await Home.findByIdAndUpdate(findHome.id, valuesToUpdate, { new: true });
    }
    const home = await getHomeData(req)
    res.status(200).json({
        status: 200,
        home,
        message: "SUCCESS",
    });
});

const updateStoryType = asyncHandler(async (req, res, next) => {
    const { StoryTypes } = req.body;
    const findHome = await Home.findOne();
    let { entity } = req.user;
    let valuesToUpdate = { StoryTypes };
    if (!findHome) {
        const createHome = await Home.create(valuesToUpdate);

    } else {
        const updateHome = await Home.findByIdAndUpdate(findHome.id, valuesToUpdate, { new: true });
    }
    const home = await getHomeData(req)
    res.status(200).json({
        status: 200,
        home,
        message: "SUCCESS",
    });
});



const createOrUpdateVideoImage = asyncHandler(async (req, res, next) => {
    const findHome = await Home.findOne();
    let { image } = req.local;
    let valuesToUpdate = {};
    let { entity } = req.user
    if (image) {
        let { path, name } = image;
        valuesToUpdate = { videoImage: { path, name }, createdBy: entity, updatedBy: entity }
    }
    else
        valuesToUpdate.$unset = { videoImage: 1 };

    if (!findHome) {
        const createHome = await Home.create(valuesToUpdate);

    } else {
        const updateHome = await Home.findByIdAndUpdate(findHome.id, valuesToUpdate, { new: true });

    }
    const home = await getHomeData(req)
    res.status(200).json({
        status: 200,
        home,
        message: "SUCCESS",
    });
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

module.exports = { updateHome, createHome, getHome, createOrUpdateVideo, createOrUpdateImage, createOrUpdateVideoImage, updateStoryType }