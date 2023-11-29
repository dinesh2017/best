const express = require("express");
const router = express.Router();
const { getSplashScreen, getSplashScreens, createSplashScreen, updateSplashScreen, deleteSplashScreen } = require("../controllers/splashscreen.controller");
const { validateToken } = require("../middleware/validateTokenHandler")
const multer = require('multer');

router.use(validateToken)

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'public/splashscreen');
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

router.route("/").get(getSplashScreens).post(upload.single("image"), createSplashScreen);

router.route("/:id").get(getSplashScreen).put(upload.single("image"), updateSplashScreen).delete(deleteSplashScreen);

module.exports = router;