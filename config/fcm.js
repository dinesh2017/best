const FCM = require('fcm-node');

const fcm = new FCM(process.env.FCM_KEY);

module.exports = fcm;