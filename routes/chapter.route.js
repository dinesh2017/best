const express = require("express");
const { audioUpload } = require("../services/upload.services");
const { validateToken } = require("../middleware/validateTokenHandler")
const fileUpload = require('express-fileupload');
const chapterService = require("../services/chapter.services");
const { getChapters, getChapter, createChapter, updateChapter, deleteChapter } = require("../controllers/chapter.controller");
const multer = require('multer');
const router = express.Router();
router.use(validateToken)

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'public/chapters');
    },
    filename(req, file, cb) {
        let filename = file.originalname.replace(/\s+/g, '').trim()
        filename = `${new Date().getTime()}_${filename}`
        cb(null, filename)
    }
})

const fileFilter = (req, file, cb) => {
    cb(null, true);
}

const upload = multer({ storage: storage, fileFilter: fileFilter });

router.use(fileUpload());



router.route("/").get(getChapters).post(audioUpload,upload.single("image"), createChapter);

router.route("/:id").get(getChapter).put(audioUpload,upload.single("image"), updateChapter).delete(deleteChapter);

router.route('/findByStory/:storyId').get(chapterService.getChaptersByStory)

module.exports = router;