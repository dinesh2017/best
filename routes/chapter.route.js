const express = require("express");
const router = express.Router();
const { getChapters, getChapter, createChapter, updateChapter, deleteChapter } = require("../controllers/chapter.controller");

router.route("/").get(getChapters).post(createChapter);

router.route("/:id").get(getChapter).put(updateChapter).delete(deleteChapter);

module.exports = router;