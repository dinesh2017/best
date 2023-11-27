const express = require("express");
const router = express.Router();
const { getAdmins, getAdmin, createAdmin, updateAdmin, deleteAdmin } = require("../controllers/admin.controller");

router.post('/register', (req, res) => {
    
})

router.post('/login', (req, res) => {

})

router.route("/").get(getAdmins).post(createAdmin);

router.route("/:id").get(getAdmin).put(updateAdmin).delete(deleteAdmin);

module.exports = router;