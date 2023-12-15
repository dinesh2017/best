const asyncHandler = require("express-async-handler");
const Subscription = require("../models/subscription.model");
const APIError = require('../utils/APIError');


const getSubscriptions = asyncHandler(async (req, res, next) => {
    try {
        const { subscriptions, count, pages } = await Subscription.list(req.query);
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            subscriptions: subscriptions,
            count, pages
        });
    } catch (error) {
        next(new APIError(error));
    }
})

const getSubscription = asyncHandler(async (req, res, next) => {
    try {
        const subscription = await Subscription.get(req.params.id)
        if (!subscription) {
            next(new APIError({ message: "Subscription not found", status: 200 }));
        }
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            subscription: subscription,
        });
    } catch (error) {
        next(new APIError(error));
    }
});

const createSubscription = asyncHandler(async (req, res, next) => {
    try {
        const { name, duration, price } = req.body;
        let { entity } = req.user
        let image = "";
        if (!name || !duration || price === undefined) {
            next(new APIError({message:"Please enter required fields", status: 400}));
        }
        const subscription = await Subscription.create({ name, duration, price, createdBy: entity });
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            subscription: subscription,
        });
    } catch (error) {
        next(new APIError(error));
    }
})

const updateSubscription = asyncHandler(async (req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id);
        if (!subscription) {
            res.status(404);
            throw new Error("Subscription not found")
        }
        const { name, duration, price } = req.body;
        let { entity } = req.user

        let _subscription = { name, duration, price, updatedBy: entity }
        const updatedSubscription = await Subscription.findByIdAndUpdate(req.params.id, _subscription, { new: true });
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            subscription: updatedSubscription,
        });
    } catch (error) {
        next(new APIError(error));
    }
})

const deleteSubscription = asyncHandler(async (req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id);
        if (!subscription) {
            res.status(404);
            throw new Error("Category not found")
        }
        let _subscription = await Subscription.findByIdAndDelete(subscription.id)
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
        });
    } catch (error) {
        next(new APIError(error));
    }
})

module.exports = { getSubscriptions, getSubscription, createSubscription, updateSubscription, deleteSubscription }