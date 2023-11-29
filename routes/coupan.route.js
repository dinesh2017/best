const express = require("express");
const router = express.Router();
const { validateToken } = require("../middleware/validateTokenHandler")
const { getCoupans, getCoupan, createCoupan, updateCoupan, deleteCoupan } = require("../controllers/coupan.controller");


router.use(validateToken)

router.route("/").get(getCoupans).post(createCoupan);

router.route("/:id").get(getCoupan).put(updateCoupan).delete(deleteCoupan);

module.exports = router;