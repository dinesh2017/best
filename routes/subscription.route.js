const express = require("express");
const homeService = require("../services/home.service");
const router = express.Router();
const { getSubscriptions, getSubscription, createSubscription, updateSubscription, deleteSubscription } = require("../controllers/subscription.controller");

const { validateToken } = require("../middleware/validateTokenHandler")

router.use(validateToken)

router.route("/").get(getSubscriptions).post(createSubscription);

router.route("/getuserplan").get(homeService.getUserPlan);

router.route("/:id").get(getSubscription).put(updateSubscription).delete(deleteSubscription);


module.exports = router;