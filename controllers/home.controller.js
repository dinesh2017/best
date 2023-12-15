const asyncHandler = require("express-async-handler");
const Home = require("../models/home.model");
const APIError = require('../utils/APIError');

const getHome = asyncHandler(async (req, res, next) => {
    try {
        const home = await Home.findOne();
        if (!home) {
            next(new APIError({ message: "Home not found", status: 200 }));
        }
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            home: home,
        });
    } catch (error) {
        next(new APIError(error));
    }
})

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

module.exports = { updateHome, createHome, getHome }