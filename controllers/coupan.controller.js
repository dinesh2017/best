const asyncHandler = require("express-async-handler");
const Coupan = require("../models/coupan.model");
const APIError = require('../utils/APIError');

const getCoupans = asyncHandler(async (req, res, next) => {
    try {
        const { coupans, count, pages } = await Coupan.list(req.query);
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            coupans: coupans,
            count, pages 
        });
    } catch (error) {
        next(new APIError(error));
    }
})

const getCoupan = asyncHandler(async (req, res, next) => {
    try {
        const coupan = await Coupan.get(req.params.id)
        if (!coupan) {
            res.status(404);
            throw new Error("Coupan not found")
        }
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            coupan: coupan,
        });
    } catch (error) {
        next(new APIError(error));
    }
});

const createCoupan = asyncHandler(async (req, res, next) => {
    try {
        const { name, discount, expiry, story, subscription } = req.body;

        let { entity } = req.user
        if (!name || !discount || !expiry) {
            res.status(400)
            throw new Error("all fields required");
        }
        const coupan = await Coupan.create({ name, discount, expiry, story, subscription, createdBy: entity });
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            coupan: coupan,
        });
    } catch (error) {
        next(new APIError(error));
    }
})

const updateCoupan = asyncHandler(async (req, res, next) => {
    try {
        const coupan = await Coupan.findById(req.params.id);
        if (!coupan) {
            res.status(404);
            throw new Error("Coupan not found")
        }
        const { name, discount, expiry, story, subscription } = req.body;
        let { entity } = req.user

        let _coupan = { name, discount, expiry, story, subscription, updatedBy: entity }
        const updatedCoupan = await Coupan.findByIdAndUpdate(req.params.id, _coupan, { new: true });
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            coupan: updatedCoupan,
        });
    } catch (error) {
        next(new APIError(error));
    }
})

const deleteCoupan = asyncHandler(async (req, res, next) => {
    try {
        const coupan = await Coupan.findById(req.params.id);
        if (!coupan) {
            res.status(404);
            throw new Error("Category not found")
        }
        let _coupan = await Coupan.findByIdAndDelete(coupan.id)
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            coupan: _coupan,
        });
    } catch (error) {
        next(new APIError(error));
    }
})

module.exports = { getCoupans, getCoupan, createCoupan, updateCoupan, deleteCoupan }