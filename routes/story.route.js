const express = require("express");
const router = express.Router();
const { getStories, getStory, createStory, updateStory, deleteStory } = require("../controllers/story.controller");
const { validateToken } = require("../middleware/validateTokenHandler")
const storyService = require("../services/story.services");
const multer = require('multer');

router.use(validateToken)

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'public/story');
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

router.route("/").get(getStories).post(upload.single("image"), createStory);
router.route('/StoriesWithChapters').get(storyService.GetStoriesWithChapters)
router.route("/:id").get(getStory).put(upload.single("image"), updateStory).delete(deleteStory);

router.route('/findByCategory/:categoryId').get(storyService.getStoriesByCategory)


module.exports = router;