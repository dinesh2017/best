const express = require("express");
const router = express.Router();
const { getSubscriptions, getSubscription, createSubscription, updateSubscription, deleteSubscription } = require("../controllers/subscription.controller");

router.route("/").get(getSubscriptions).post(createSubscription);

router.route("/:id").get(getSubscription).put(updateSubscription).delete(deleteSubscription);

module.exports = router;