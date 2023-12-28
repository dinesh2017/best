const express = require("express");
const router = express.Router();
const { validateToken } = require("../middleware/validateTokenHandler")
const { getNotifications, getNotification, createNotification, updateNotification, deleteNotification } = require("../controllers/notification.controller");

router.use(validateToken)

router.route("/").get(getNotifications).post(createNotification);

router.route("/:id").get(getNotification).put(updateNotification).delete(deleteNotification);

module.exports = router;