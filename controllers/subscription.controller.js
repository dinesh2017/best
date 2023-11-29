const asyncHandler = require("express-async-handler");
const Subscription = require("../models/subscription.model");


const getSubscriptions = asyncHandler(async (req, res) => {
    try {
        const subscriptions = await Subscription.list(req.query);
        res.status(200).json(subscriptions);
    } catch (err) {
        res.status(500);
        throw new Error(err)
    }
})

const getSubscription = asyncHandler(async (req, res) => {
    try {
        const subscription = await Subscription.get(req.params.id)
        if (!subscription) {
            res.status(404);
            throw new Error("Subscription not found")
        }
        res.status(200).json(subscription);
    } catch (err) {
        res.status(500);
        throw new Error(err)
    }
});

const createSubscription = asyncHandler(async (req, res) => {
    try {
        const { name, duration, price } = req.body;
        let { entity } = req.user
        let image = "";
        if (!name || !duration || !price) {
            res.status(400)
            throw new Error("Subscription name is required");
        }
        const subscription = await Subscription.create({ name, duration, price, createdBy: entity });
        res.status(201).json(subscription)
    } catch (err) {
        res.status(500);
        throw new Error(err)
    }
})

const updateSubscription = asyncHandler(async (req, res) => {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
        res.status(404);
        throw new Error("Subscription not found")
    }
    const { name, duration, price } = req.body;
    let { entity } = req.user

    let _subscription = { name, duration, price, updatedBy: entity }
    const updatedSubscription = await Subscription.findByIdAndUpdate(req.params.id, _subscription, { new: true });
    res.status(200).json(updatedSubscription);
})

const deleteSubscription = asyncHandler(async (req, res) => {
    try {
        const subscription = await Subscription.findById(req.params.id);
        console.log(subscription)
        if (!subscription) {
            res.status(404);
            throw new Error("Subscription not found")
        }
        await Subscription.remove();
        res.status(200).json(subscription);
    } catch (err) {
        res.status(500);
        throw new Error(err)
    }
})

module.exports = { getSubscriptions, getSubscription, createSubscription, updateSubscription, deleteSubscription }