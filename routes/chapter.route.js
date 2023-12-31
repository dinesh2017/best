const express = require("express");
const { audioUpload } = require("../services/upload.services");
const { validateToken } = require("../middleware/validateTokenHandler")
const fileUpload = require('express-fileupload');
const chapterService = require("../services/chapter.services");
const { getChapters, getChapter, createChapter, updateChapter, deleteChapter } = require("../controllers/chapter.controller");
const router = express.Router();
router.use(validateToken)

router.use(fileUpload({parseNested:true}));

// upload, 
router.route("/").get(getChapters).post(audioUpload,createChapter);
router.route("/getById/:id").get(chapterService.getChatpterById);
router.route("/:id").get(getChapter).put(audioUpload,updateChapter).delete(deleteChapter);

router.route('/findByStory/:storyId').get(chapterService.getChaptersByStory)

module.exports = router;