const express = require("express");
const router = express.Router();
const { getSlide, getSlides, createSlides, updateSlides, deleteSlides } = require("../controllers/slides.controller");
const { validateToken } = require("../middleware/validateTokenHandler")
const multer = require('multer');

router.use(validateToken)

const storage = multer.diskStorage({
    destination (req, file, cb) {
        cb(null, 'public/slides');
    },
    filename (req, file, cb) {
        let filename = file.originalname.replace(/\s+/g, '').trim()
        filename = `${new Date().getTime()}_${filename}`
        cb(null, filename)
    }
})

const fileFilter = (req,file,cb) => {
    cb(null, true);
}

const upload = multer({storage: storage, fileFilter : fileFilter});

router.route("/").get(getSlides).post(upload.single("image"), createSlides);

router.route("/:id").get(getSlide).put(upload.single("image"),updateSlides).delete(deleteSlides);

module.exports = router;