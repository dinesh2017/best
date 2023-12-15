const express = require("express");
const router = express.Router();
const { getSubscribers, getSubscriber, createSubscriber, updateSubscriber, deleteSubscriber } = require("../controllers/subscriber.controller");
const { validateToken } = require("../middleware/validateTokenHandler")

router.use(validateToken)

router.route("/").get(getSubscribers).post(createSubscriber);

router.route("/:id").get(getSubscriber).put(updateSubscriber).delete(deleteSubscriber);

module.exports = router;