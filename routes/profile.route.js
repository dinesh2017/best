const express = require("express");
const router = express.Router();
const { getProfiles, getProfile, createProfile, updateProfile, deleteProfile } = require("../controllers/profile.controller");
const { validateToken } = require("../middleware/validateTokenHandler")
const multer = require('multer');
const profileService = require("../services/profile.services");

router.use(validateToken)

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'public/profile');
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

router.route("/").get(getProfiles).post(upload.single("image"), createProfile);

router.route('/getAllProfiles').get(profileService.getProfilesByUser)

router.route("/:id").get(getProfile).put(upload.single("image"), updateProfile).delete(deleteProfile);



module.exports = router;