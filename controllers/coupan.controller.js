const asyncHandler = require("express-async-handler");
const Coupan = require("../models/coupan.model");


const getCoupans = asyncHandler(async (req, res) => {
    try {
        const coupans = await Coupan.list(req.query);
        res.status(200).json(coupans);
    } catch (err) {
        res.status(500);
        throw new Error(err)
    }
})

const getCoupan = asyncHandler(async (req, res) => {
    try {
        const coupan = await Coupan.get(req.params.id)
        if (!coupan) {
            res.status(404);
            throw new Error("Coupan not found")
        }
        res.status(200).json(coupan);
    } catch (err) {
        res.status(500);
        throw new Error(err)
    }
});

const createCoupan = asyncHandler(async (req, res) => {
    try {
        const { name, discount, expiry, story } = req.body;
        let { entity } = req.user
        if (!name || !discount || !expiry || !story) {
            res.status(400)
            throw new Error("Subscription name is required");
        }
        const coupan = await Coupan.create({ name, discount, expiry, story, createdBy: entity });
        res.status(201).json(coupan)
    } catch (err) {
        res.status(500);
        throw new Error(err)
    }
})

const updateCoupan = asyncHandler(async (req, res) => {
    const coupan = await Coupan.findById(req.params.id);
    if (!coupan) {
        res.status(404);
        throw new Error("Coupan not found")
    }
    const { name, discount, expiry, story } = req.body;
    let { entity } = req.user

    let _coupan = { name, discount, expiry, story, updatedBy: entity }
    const updatedCoupan = await Coupan.findByIdAndUpdate(req.params.id, _coupan, { new: true });
    res.status(200).json(updatedCoupan);
})

const deleteCoupan = asyncHandler(async (req, res) => {
    try {
        const coupan = await Coupan.findById(req.params.id);
        console.log(coupan)
        if (!coupan) {
            res.status(404);
            throw new Error("Coupan not found")
        }
        await Coupan.remove();
        res.status(200).json(coupan);
    } catch (err) {
        res.status(500);
        throw new Error(err)
    }
})

module.exports = { getCoupans, getCoupan, createCoupan, updateCoupan, deleteCoupan }