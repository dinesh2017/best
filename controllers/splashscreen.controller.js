const asyncHandler = require("express-async-handler");
const SplashScreen = require("../models/splashscreen.model");


const getSplashScreens = asyncHandler(async (req, res) => {
    try {
        const subscriptions = await SplashScreen.list(req.query);
        res.status(200).json(subscriptions);
    } catch (err) {
        res.status(500);
        throw new Error(err)
    }
})

const getSplashScreen = asyncHandler(async (req, res) => {
    try {
        const splashscreen = await SplashScreen.get(req.params.id)
        if (!splashscreen) {
            res.status(404);
            throw new Error("splash Screen not found")
        }
        res.status(200).json(splashscreen);
    } catch (err) {
        res.status(500);
        throw new Error(err)
    }
});

const createSplashScreen = asyncHandler(async (req, res) => {
    try {
        const { name, duration, price } = req.body;
        let { entity } = req.user
        let image = "";
        if (!name) {
            res.status(400)
            throw new Error("splashscreen name is required");
        }
        if (req.file) {
            const url = `/splashscreen/${req.file.filename}`;
            image = { path: url, name: req.file.filename }
        }
        const splashscreen = await SplashScreen.create({ name, image, createdBy: entity });
        res.status(201).json(splashscreen)
    } catch (err) {
        res.status(500);
        throw new Error(err)
    }
})

const updateSplashScreen = asyncHandler(async (req, res) => {
    const splashscreen = await SplashScreen.findById(req.params.id);
    if (!splashscreen) {
        res.status(404);
        throw new Error("splash screen not found")
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
    res.status(200).json(updatedSplashscreen);
})

const deleteSplashScreen = asyncHandler(async (req, res) => {
    try{
        const splashScreen = await SplashScreen.findById(req.params.id);
        if (!splashScreen) {
            res.status(404);
            throw new Error("Category not found")
        }
        let _splashScreen = await SplashScreen.findByIdAndDelete(splashScreen.id)
        res.status(200).json(_splashScreen);
    }catch(err){
        res.status(404);
        throw new Error(err)
    }
})

module.exports = { getSplashScreens, getSplashScreen, createSplashScreen, updateSplashScreen, deleteSplashScreen }