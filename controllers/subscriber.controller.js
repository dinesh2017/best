const asyncHandler = require("express-async-handler");
const Subscriber = require("../models/subscriber.model");
const APIError = require('../utils/APIError');


const getSubscribers = asyncHandler(async (req, res, next) => {
    try {
        const subscribers = await Subscriber.find()
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            subscribers: subscribers,
        });
    } catch (error) {
        next(new APIError(error));
    }
})

const getSubscriber = asyncHandler(async (req, res, next) => {
    try {
        const subscriber = await Subscriber.findById(req.params.id);
        if (!subscriber) {
            res.status(404);
            throw new Error("Subscriber not found")
        }
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            subscriber: subscriber,
        });
    } catch (error) {
        next(new APIError(error));
    }
});

const createSubscriber = asyncHandler(async (req, res, next) => {
    try {
        const { name } = req.body;
        if (!name) {
            res.status(400)
            throw new Error("Subscriber name is required");
        }
        const subscriber = await Subscriber.create({ name });
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            subscriber: subscriber,
        });
    } catch (error) {
        next(new APIError(error));
    }
})

const updateSubscriber = asyncHandler(async (req, res, next) => {
    try {
        const subscriber = await Subscriber.findById(req.params.id);
        if (!subscriber) {
            res.status(404);
            throw new Error("Subscriber not found")
        }
        const updatedSubscriber = await Subscriber.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            subscriber: updatedSubscriber,
        });
    } catch (error) {
        next(new APIError(error));
    }
})

const deleteSubscriber = asyncHandler(async (req, res, next) => {
    try {
        const subscriber = await Subscriber.findById(req.params.id);
        console.log(subscriber)
        if (!subscriber) {
            res.status(404);
            throw new Error("Subscriber not found")
        }
        await Subscriber.remove();
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
        });
    } catch (error) {
        next(new APIError(error));
    }
})

module.exports = { getSubscribers, getSubscriber, createSubscriber, updateSubscriber, deleteSubscriber }