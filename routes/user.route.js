const express = require("express");
const router = express.Router();
const { getUsers, getUser, getUserInfo, uploadProfilePic, createUser, updateUser, deleteUser } = require("../controllers/user.controller");

const { validateToken } = require("../middleware/validateTokenHandler")

const multer = require('multer');

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

router.route('/userinfo').get(getUserInfo);

router.route('/updateprofilepic').post(upload.single("image"), uploadProfilePic);

router.route("/").get(getUsers).post(createUser);

router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;