const asyncHandler = require("express-async-handler");
const Subscriber = require("../models/subscriber.model");
const Subscription = require("../models/subscription.model");
const APIError = require('../utils/APIError');

const addDays = (date, days) => {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

const getSubscribers = asyncHandler(async (req, res, next) => {
    try {
        const { subscribers, count, pages } = await Subscriber.list(req.query);
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            subscribers, count, pages
        });
    } catch (error) {
        next(new APIError(error));
    }
})

const getSubscriber = asyncHandler(async (req, res, next) => {
    try {
        const subscriber = await Subscriber.get(req.params.id);
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

        const { orderId, subscription, price, discount, total, orderDate, paymentStatus, coupan } = req.body;
        
        let { entity } = req.user;
        if (!orderId || !subscription || price === undefined || discount === undefined || total === undefined || !orderDate || !paymentStatus) {
            next(new APIError({message:"Please entered required fileds", status : 400}));
        }
        const subscription_ = await Subscription.findById(subscription);

        await Subscriber.updateMany({ user: entity }, { activePlan: 0 });
        let createdDate = new Date();
        let expiryDate = addDays(createdDate, (subscription_.duration * 30));
        const subscriber = await Subscriber.create({ orderId, subscription, price, discount,expiryDate, user:entity, total, orderDate, paymentStatus, coupan });
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