const express = require("express");
const router = express.Router();
const { getCoupans, getCoupan, createCoupan, updateCoupan, deleteCoupan } = require("../controllers/coupan.controller");

router.route("/").get(getCoupans).post(createCoupan);

router.route("/:id").get(getCoupan).put(updateCoupan).delete(deleteCoupan);

module.exports = router;