const express = require("express");
const router = express.Router();
const { validateToken } = require("../middleware/validateTokenHandler")
const { getTags, getTag, createTag, updateTag, deleteTag } = require("../controllers/tags.controller");

router.use(validateToken)

router.route("/").get(getTags).post(createTag);

router.route("/:id").get(getTag).put(updateTag).delete(deleteTag);

module.exports = router;