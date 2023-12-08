const asyncHandler = require("express-async-handler");
const Category = require("../models/category.model");
const APIError = require('../utils/APIError');

const getCategories = asyncHandler(async (req, res, next) => {
    try {
        const { categorys, count, pages } = await Category.list(req.query);
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            categories: categorys,
            count, pages
        });
    } catch (error) {
        next(new APIError(error));
    }
})

const getCategory = asyncHandler(async (req, res, next) => {
    try {
        const category = await Category.get(req.params.id)
        if (!category) {
            next(new APIError({ message: "Category not found", status: 200 }));
        }
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            category: category,
        });
    } catch (error) {
        next(new APIError(error));
    }
});

const createCategory = asyncHandler(async (req, res, next) => {
    try {
        const { name } = req.body;
        let { entity } = req.user
        let image = "";
        if (!name) {
            next(new APIError({ message: "Category name is required", status: 200 }));
        }
        if (req.file) {
            //${req.protocol}://${req.get('host')}
            const url = `/category/${req.file.filename}`;
            image = { path: url, name: req.file.filename }
        }
        const category = await Category.create({ name, image, createdBy: entity });
        res.status(200).json({
            status: 200,
            category: category,
            message: "SUCCESS",
        });
    } catch (error) {
        next(new APIError(error));
    }

})

const updateCategory = asyncHandler(async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            next(new APIError({ message: "Category not found", status: 200 }));
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
        res.status(200).json({
            status: 200,
            category: updatedCategory,
            message: "SUCCESS",
        });
    } catch (error) {
        next(new APIError(error));
    }
})

const deleteCategory = asyncHandler(async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            next(new APIError({ message: "Category not found", status: 200 }));
        }
        let _category = await Category.findByIdAndDelete(category.id)
        res.status(200).json({
            status: 200,
            category: _category,
            message: "SUCCESS",
        });
    } catch (error) {
        next(new APIError(error));
    }

})


module.exports = { getCategories, getCategory, createCategory, updateCategory, deleteCategory }