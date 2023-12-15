const express = require("express");
const router = express.Router();
const { getLibraries, createLibrary, updateLibrary, deleteLibrary } = require("../controllers/library.controller");
const { validateToken } = require("../middleware/validateTokenHandler")

router.use(validateToken)

router.route("/").get(getLibraries).post(createLibrary);

router.route("/:id").put(updateLibrary).delete(deleteLibrary);

module.exports = router;