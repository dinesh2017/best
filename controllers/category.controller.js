const asyncHandler = require("express-async-handler");
const Category = require("../models/category.model");


const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find()
    res.status(200).json(categories);
})

const getCategory = asyncHandler(async (req, res) => {
    const user = await Category.findById(req.params.id);
    if (!user) {
        res.status(404);
        throw new Error("Category not found")
    }
    res.status(200).json(user);
});

const createCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;
    let { entity } = req.user
    if (!name) {
        res.status(400)
        throw new Error("Category name is required");
    }
    const user = await Category.create({ name, createdBy: entity });
    res.status(201).json(user);
})

const updateCategory = asyncHandler(async (req, res) => {
    const user = await Category.findById(req.params.id);
    if (!user) {
        res.status(404);
        throw new Error("Category not found")
    }
    const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedCategory);
})

const deleteCategory = asyncHandler(async (req, res) => {
    const user = await Category.findById(req.params.id);
    console.log(user)
    if (!user) {
        res.status(404);
        throw new Error("Category not found")
    }
    await Category.remove();
    res.status(200).json(user);
})

module.exports = { getCategories, getCategory, createCategory, updateCategory, deleteCategory }