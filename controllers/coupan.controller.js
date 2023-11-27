const asyncHandler = require("express-async-handler");
const Coupan = require("../models/coupan.model");


const getCoupans = asyncHandler(async (req, res) => {
    const coupan = await Coupan.find()
    res.status(200).json(coupan);
})

const getCoupan = asyncHandler(async (req, res) => {
    const coupan = await Coupan.findById(req.params.id);
    if(!coupan){
        res.status(404);
        throw new Error("Coupan not found")
    }
    res.status(200).json(coupan);
});

const createCoupan = asyncHandler(async (req, res) => {
    const { name } = req.body;
    if (!name) {
        res.status(400)
        throw new Error("Coupan name is required");
    }
    const coupan = await Coupan.create({ name });
    res.status(201).json(coupan);
})

const updateCoupan = asyncHandler(async (req, res) => {
    const coupan = await Coupan.findById(req.params.id);
    if(!coupan){
        res.status(404);
        throw new Error("Coupan not found")
    }
    const updatedCoupan = await Coupan.findByIdAndUpdate(req.params.id, req.body, {new : true});
    res.status(200).json(updatedCoupan);
})

const deleteCoupan = asyncHandler(async (req, res) => {
    const coupan = await Coupan.findById(req.params.id);
    console.log(coupan)
    if(!coupan){
        res.status(404);
        throw new Error("Coupan not found")
    }
    await Coupan.remove();
    res.status(200).json(coupan);
})

module.exports = { getCoupans, getCoupan, createCoupan, updateCoupan, deleteCoupan }