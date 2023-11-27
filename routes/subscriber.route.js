const express = require("express");
const router = express.Router();
const { getSubscribers, getSubscriber, createSubscriber, updateSubscriber, deleteSubscriber } = require("../controllers/subscriber.controller");

router.route("/").get(getSubscribers).post(createSubscriber);

router.route("/:id").get(getSubscriber).put(updateSubscriber).delete(deleteSubscriber);

module.exports = router;