const express = require("express");
const chapterService = require("../services/chapter.services");
const homeService = require("../services/home.service");
const router = express.Router();

router.route("/chapter/getaduio/:id").get(chapterService.getChatpterAudioById);
router.route("/home/getvideo/:id").get(homeService.getHomeVideoById);

module.exports = router;