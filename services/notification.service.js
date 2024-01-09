const asyncHandler = require("express-async-handler");
const fcm = require('../config/fcm');
const User = require("../models/auth/user.model");
const Notification = require("../models/notification.model");
const APIError = require('../utils/APIError');

exports.removedNotification = asyncHandler(async (req, res, next) => {
    try{
        const noitification = await Notification.get(req.params.id)
        let { entity } = req.user;
        console.log(noitification)
        if(noitification){
            await Notification.updateOne({ _id: noitification.id }, { $push: { removed: entity } });
        }
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
        });
    }catch (error) {
        next(new APIError(error));
    }
});

exports.sendNotification = async (users = [], title, message) => {
    // if (users.length != 0) {
        var result = "";
    // } else {
    let fcmIds = []
    const query = User.find(
        {
            'mobileDeviceInfo.fcmId': { $exists: true, $ne: null },
        },
        { _id: 0, 'mobileDeviceInfo.fcmId': 1 });
    query.then((users) => {
        users.map(user => fcmIds.push(user.mobileDeviceInfo.fcmId));
        console.log(fcmIds)
        if (fcmIds.length != 0) {
            var pushMessage = {
                registration_ids: fcmIds,
                notification: {
                    title: title,
                    body: message,
                }
            }
            fcm.send(pushMessage, (err, response) => {
                if (err) {
                    console.log(err)
                    result = err
                } else {
                    console.log(response)
                    result = response
                }
            })
        }
    }).catch((err) => {

    });
    return result;
}