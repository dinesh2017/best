const express = require("express");
const router = express.Router();
const { fileUpload } = require("../services/upload.services");
const multer = require('multer')

const { validateToken } = require("../middleware/validateTokenHandler")

const { getCategories, getCategory, createCategory, updateCategory, deleteCategory } = require("../controllers/category.controller");

router.use(validateToken)

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
});

router.route("/").get(getCategories).post(fileUpload, createCategory);

router.route("/:id").get(getCategory).put(updateCategory).delete(deleteCategory);

module.exports = router;