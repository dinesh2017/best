const asyncHandler = require("express-async-handler");
const Notification = require("../models/notification.model");
const APIError = require('../utils/APIError');

const getNotifications = asyncHandler(async (req, res, next) => {
    try {
        const { notification, count, pages } = await Notification.list(req.query);
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            notifications: notification,
            count, pages
        });
    } catch (error) {
        next(new APIError(error));
    }
})

const getNotification = asyncHandler(async (req, res, next) => {
    try {
        const notification = await Notification.get(req.params.id)
        if (!notification) {
            next(new APIError({ message: "Notification not found", status: 200 }));
        }
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            notification: notification,
        });
    } catch (error) {
        next(new APIError(error));
    }
});

const createNotification = asyncHandler(async (req, res, next) => {
    try {
        const { title, type, msg } = req.body;
        let { entity } = req.user
        if (!msg) {
            next(new APIError({ message: "Notification name is required", status: 200 }));
        }
        const notification = await Notification.create({ title, type, msg, createdBy: entity });
        res.status(200).json({
            status: 200,
            notification: notification,
            message: "SUCCESS",
        });
    } catch (error) {
        next(new APIError(error));
    }

})

const updateNotification = asyncHandler(async (req, res, next) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) {
            next(new APIError({ message: "Notification not found", status: 200 }));
        }
        const { title, type, msg } = req.body;
        let { entity } = req.user
       
        let _notification = { title, type, msg, image, updatedBy: entity }
        const updatedNotification = await Notification.findByIdAndUpdate(req.params.id, _notification, { new: true });
        res.status(200).json({
            status: 200,
            category: updatedNotification,
            message: "SUCCESS",
        });
    } catch (error) {
        next(new APIError(error));
    }
})

const deleteNotification = asyncHandler(async (req, res, next) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) {
            next(new APIError({ message: "Notification not found", status: 200 }));
        }
        let _notification = await Notification.findByIdAndDelete(notification.id)
        res.status(200).json({
            status: 200,
            notification: notification,
            message: "SUCCESS",
        });
    } catch (error) {
        next(new APIError(error));
    }

})


module.exports = { getNotifications, getNotification, createNotification, updateNotification, deleteNotification }