const express = require("express");
const router = express.Router();
const { fileUpload } = require("../services/upload.services");
// const imageLib = require("../utils/imageLib");
const { getCategories, getCategory, createCategory, updateCategory, deleteCategory } = require("../controllers/category.controller");
const { validateToken } = require("../middleware/validateTokenHandler")
const multer = require('multer');

router.use(validateToken)

const storage = multer.diskStorage({
    destination (req, file, cb) {
        cb(null, 'public/category');
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

router.route("/").get(getCategories).post(upload.single("image"), createCategory);

router.route("/:id").get(getCategory).put(upload.single("image"),updateCategory).delete(deleteCategory);

module.exports = router;