const asyncHandler = require("express-async-handler");
const SplashScreen = require("../models/splashscreen.model");
const APIError = require('../utils/APIError');

const getSplashScreens = asyncHandler(async (req, res, next) => {
    try {
        const { splashScreens, count, pages } = await SplashScreen.list(req.query);
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            splashScreens,
            count,
            pages
        });
    } catch (error) {
        next(new APIError(error));
    }
})

const getSplashScreen = asyncHandler(async (req, res, next) => {
    try {
        const splashscreen = await SplashScreen.get(req.params.id)
        if (!splashscreen) {
            next(new APIError({ message: "Splash Screen not found", status: 200 }));
        }
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            splashscreen
        });
    } catch (error) {
        next(new APIError(error));
    }
});

const createSplashScreen = asyncHandler(async (req, res, next) => {
    try {
        const { name, duration, price } = req.body;
        let { entity } = req.user
        let image = "";
        if (!name) {
            next(new APIError({ message: "Please enter required fields", status: 200 }));
        }
        if (req.file) {
            const url = `/splashscreen/${req.file.filename}`;
            image = { path: url, name: req.file.filename }
        }
        const splashscreen = await SplashScreen.create({ name, image, createdBy: entity });
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            splashscreen: splashscreen,
        });
    } catch (error) {
        next(new APIError(error));
    }
})

const updateSplashScreen = asyncHandler(async (req, res, next) => {
    const splashscreen = await SplashScreen.findById(req.params.id);
    if (!splashscreen) {
        next(new APIError({ message: "Splash Screen not found", status: 200 }));
    }
    let image = "";
    if (req.file) {
        const url = `/splashscreen/${req.file.filename}`;
        image = { path: url, name: req.file.filename }
    }
    const { name } = req.body;
    let { entity } = req.user
    let _splashscreen = { name, image, updatedBy: entity }
    const updatedSplashscreen = await SplashScreen.findByIdAndUpdate(req.params.id, _splashscreen, { new: true });
    res.status(200).json({
        status: 200,
        message: "SUCCESS",
        splashscreen: updatedSplashscreen,
    });
})

const deleteSplashScreen = asyncHandler(async (req, res, next) => {
    try {
        const splashScreen = await SplashScreen.findById(req.params.id);
        if (!splashScreen) {
            next(new APIError({ message: "Splash Screen not found", status: 200 }));
        }
        let _splashScreen = await SplashScreen.findByIdAndDelete(splashScreen.id)
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            splashscreen: _splashScreen,
        });
    } catch (error) {
        next(new APIError(error));
    }
})

module.exports = { getSplashScreens, getSplashScreen, createSplashScreen, updateSplashScreen, deleteSplashScreen }