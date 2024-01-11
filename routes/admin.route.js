const express = require("express");
const router = express.Router();
const { getAdmins, getAdmin, createAdmin, updateAdmin, deleteAdmin, getDashboard, login, geUserDetails } = require("../controllers/admin.controller");

router.route("/login").post(login);
router.route("/").get(getAdmins).post(createAdmin);
router.route("/dashboard").get(getDashboard);
router.route("/user-details/:id").get(geUserDetails)

router.route("/:id").get(getAdmin).put(updateAdmin).delete(deleteAdmin);

module.exports = router;