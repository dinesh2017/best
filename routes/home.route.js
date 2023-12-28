const express = require('express');
const router = express.Router();
const { validateToken } = require("../middleware/validateTokenHandler");
const { updateHome, createHome, getHome } = require("../controllers/home.controller");
const homeService = require("../services/home.service");
const multer = require('multer');
router.use(validateToken)

const storage = multer.diskStorage({
    destination (req, file, cb) {
        cb(null, 'public/home');
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

router.route("/").post(upload.single("image"), createHome).get(getHome);

router.route("/:id").put(upload.single("image"),updateHome);

router.route("/getdata").get(homeService.getHomeData);

module.exports = router;