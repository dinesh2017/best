const asyncHandler = require("express-async-handler");
const Slides = require("../models/slides.model");
const APIError = require('../utils/APIError');

const getSlides = asyncHandler(async (req, res, next) => {
    try {
        const { slides, count, pages } = await Slides.list(req.query);
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            slides: slides,
            count, pages
        });
    } catch (error) {
        next(new APIError(error));
    }
})

const getSlide = asyncHandler(async (req, res, next) => {
    try {
        const slide = await Slides.get(req.params.id)
        if (!slide) {
            next(new APIError({ message: "Slide not found", status: 200 }));
        }
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            slide: slide,
        });
    } catch (error) {
        next(new APIError(error));
    }
});

const createSlides = asyncHandler(async (req, res, next) => {
    try {
        const { title, description, action } = req.body;
        let { entity } = req.user
        let image = "";
        if (!title) {
            next(new APIError({ message: "Please entered required files", status: 200 }));
        }
        if (req.file) {
            const url = `/slides/${req.file.filename}`;
            image = { path: url, name: req.file.filename }
        }
        const slide = await Slides.create({ title, description, action, image, createdBy: entity });
        res.status(200).json({
            status: 200,
            slide: slide,
            message: "SUCCESS",
        });
    } catch (error) {
        next(new APIError(error));
    }

})

const updateSlides = asyncHandler(async (req, res, next) => {
    try {
        const slide = await Slides.findById(req.params.id);
        if (!slide) {
            next(new APIError({ message: "Slides not found", status: 200 }));
        }
        const { title, description, action } = req.body;
        let { entity } = req.user
        let image;
        if (req.file) {
            const url = `/slides/${req.file.filename}`;
            image = { path: url, name: req.file.filename }
        }
        let _slide = { title, description, action, image, updatedBy: entity }
        const updatedSlides = await Slides.findByIdAndUpdate(req.params.id, _slide, { new: true });
        res.status(200).json({
            status: 200,
            slide: updatedSlides,
            message: "SUCCESS",
        });
    } catch (error) {
        next(new APIError(error));
    }
})

const deleteSlides = asyncHandler(async (req, res, next) => {
    try {
        const slide = await Slides.findById(req.params.id);
        if (!slide) {
            next(new APIError({ message: "Slides not found", status: 200 }));
        }
        let _slide = await Slides.findByIdAndDelete(slide.id)
        res.status(200).json({
            status: 200,
            slide: _slide,
            message: "SUCCESS",
        });
    } catch (error) {
        next(new APIError(error));
    }

})


module.exports = { getSlide, getSlides, createSlides, updateSlides, deleteSlides }