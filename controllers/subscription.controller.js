const asyncHandler = require("express-async-handler");
const Subscription = require("../models/subscription.model");


const getSubscriptions = asyncHandler(async (req, res) => {
    const categories = await Subscription.find()
    res.status(200).json(categories);
})

const getSubscription = asyncHandler(async (req, res) => {
    const subscription = await Subscription.findById(req.params.id);
    if(!subscription){
        res.status(404);
        throw new Error("Subscription not found")
    }
    res.status(200).json(subscription);
});

const createSubscription = asyncHandler(async (req, res) => {
    const { name } = req.body;
    if (!name) {
        res.status(400)
        throw new Error("Subscription name is required");
    }
    const subscription = await Subscription.create({ name });
    res.status(201).json(subscription);
})

const updateSubscription = asyncHandler(async (req, res) => {
    const subscription = await Subscription.findById(req.params.id);
    if(!subscription){
        res.status(404);
        throw new Error("Subscription not found")
    }
    const updatedSubscription = await Subscription.findByIdAndUpdate(req.params.id, req.body, {new : true});
    res.status(200).json(updatedSubscription);
})

const deleteSubscription = asyncHandler(async (req, res) => {
    const subscription = await Subscription.findById(req.params.id);
    console.log(subscription)
    if(!subscription){
        res.status(404);
        throw new Error("Subscription not found")
    }
    await Subscription.remove();
    res.status(200).json(subscription);
})

module.exports = { getSubscriptions, getSubscription, createSubscription, updateSubscription, deleteSubscription }