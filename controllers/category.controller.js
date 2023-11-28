const asyncHandler = require("express-async-handler");
const Category = require("../models/category.model");


const getCategories = asyncHandler(async (req, res) => {
    try {
        const categorys = await Category.list(req.query);
        res.status(200).json(categorys);
    } catch (err) {
        res.status(500);
        throw new Error(err)
    }
})

const getCategory = asyncHandler(async (req, res) => {
    try {
        const category = await Category.get(req.params.id)
        if (!category) {
            res.status(404);
            throw new Error("Category not found")
        }
        res.status(200).json(category);
    } catch (err) {
        res.status(500);
        throw new Error(err)
    }
});

const createCategory = asyncHandler(async (req, res) => {
    try {
        const { name } = req.body;
        let { entity } = req.user
        let image = "";
        if (!name) {
            res.status(400)
            throw new Error("Category name is required");
        }
        if (req.file) {
            //${req.protocol}://${req.get('host')}
            const url = `/category/${req.file.filename}`;
            image = { path: url, name: req.file.filename }
        }
        const user = await Category.create({ name, image, createdBy: entity });
        res.status(201).json(user)
    } catch (err) {
        res.status(500);
        throw new Error(err)
    }

})

const updateCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
        res.status(404);
        throw new Error("Category not found")
    }
    const { name } = req.body;
    let { entity } = req.user
    if (req.file) {
        //${req.protocol}://${req.get('host')}
        const url = `/category/${req.file.filename}`;
        image = { path: url, name: req.file.filename }
    }
    let _category = { name, image, updatedBy: entity }
    const updatedCategory = await Category.findByIdAndUpdate(req.params.id, _category, { new: true });
    res.status(200).json(updatedCategory);
})

const deleteCategory = asyncHandler(async (req, res) => {
    const user = await Category.findById(req.params.id);
    if (!user) {
        res.status(404);
        throw new Error("Category not found")
    }
    await Category.remove();
    res.status(200).json(user);
})


module.exports = { getCategories, getCategory, createCategory, updateCategory, deleteCategory }