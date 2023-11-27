const asyncHandler = require("express-async-handler");
const Subscriber = require("../models/subscriber.model");


const getSubscribers = asyncHandler(async (req, res) => {
    const categories = await Subscriber.find()
    res.status(200).json(categories);
})

const getSubscriber = asyncHandler(async (req, res) => {
    const subscriber = await Subscriber.findById(req.params.id);
    if(!subscriber){
        res.status(404);
        throw new Error("Subscriber not found")
    }
    res.status(200).json(subscriber);
});

const createSubscriber = asyncHandler(async (req, res) => {
    const { name } = req.body;
    if (!name) {
        res.status(400)
        throw new Error("Subscriber name is required");
    }
    const subscriber = await Subscriber.create({ name });
    res.status(201).json(subscriber);
})

const updateSubscriber = asyncHandler(async (req, res) => {
    const subscriber = await Subscriber.findById(req.params.id);
    if(!subscriber){
        res.status(404);
        throw new Error("Subscriber not found")
    }
    const updatedSubscriber = await Subscriber.findByIdAndUpdate(req.params.id, req.body, {new : true});
    res.status(200).json(updatedSubscriber);
})

const deleteSubscriber = asyncHandler(async (req, res) => {
    const subscriber = await Subscriber.findById(req.params.id);
    console.log(subscriber)
    if(!subscriber){
        res.status(404);
        throw new Error("Subscriber not found")
    }
    await Subscriber.remove();
    res.status(200).json(subscriber);
})

module.exports = { getSubscribers, getSubscriber, createSubscriber, updateSubscriber, deleteSubscriber }