const express = require("express");
const router = express.Router();
const { validateToken } = require("../middleware/validateTokenHandler")

const { getCategories, getCategory, createCategory, updateCategory, deleteCategory } = require("../controllers/category.controller");

router.use(validateToken)
router.route("/").get(getCategories).post(createCategory);
router.route("/:id").get(getCategory).put(updateCategory).delete(deleteCategory);

module.exports = router;