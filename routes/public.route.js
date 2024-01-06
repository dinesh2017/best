const express = require("express");
const chapterService = require("../services/chapter.services");
const router = express.Router();

router.route("/chapter/getaduio/:id").get(chapterService.getChatpterAudioById);

module.exports = router;