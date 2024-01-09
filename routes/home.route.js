const express = require('express');
const router = express.Router();
const { validateToken } = require("../middleware/validateTokenHandler");
const { updateHome, createHome, getHome, createOrUpdateVideo,createOrUpdateImage, createOrUpdateVideoImage, updateStoryType } = require("../controllers/home.controller");
const homeService = require("../services/home.service");
const multer = require('multer');
router.use(validateToken)
const fileUpload = require('express-fileupload');
router.use(fileUpload({parseNested:true}));
const { audioUpload } = require("../services/upload.services");

// const storage = multer.diskStorage({
//     destination (req, file, cb) {
//         cb(null, 'public/home');
//     },
//     filename (req, file, cb) {
//         let filename = file.originalname.replace(/\s+/g, '').trim()
//         filename = `${new Date().getTime()}_${filename}`
//         cb(null, filename)
//     }
// })

// const fileFilter = (req,file,cb) => {
//     cb(null, true);
// }

// const upload = multer({storage: storage, fileFilter : fileFilter});

router.route("/").post(createHome).get(getHome);

router.route("/uploadVideo").post(audioUpload, createOrUpdateVideo)
router.route("/uploadImage").post(audioUpload, createOrUpdateImage)
router.route("/uploadVideoImage").post(audioUpload, createOrUpdateVideoImage)
router.route("/updateStoryType").post(audioUpload, updateStoryType);


router.route("/:id").put(updateHome);

router.route("/getdata").get(homeService.getHomeData);

module.exports = router;