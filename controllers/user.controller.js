const asyncHandler = require("express-async-handler");
const User = require("../models/auth/user.model");
const APIError = require('../utils/APIError');

const getUsers = asyncHandler(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        status: 200,
        message: "SUCCESS",
        users
    });
    res.status(200).json(users);
})

const getUserInfo = asyncHandler(async (req, res, next) => {
    try {
        let { entity } = req.user
        const user = await User.get(entity);
        if (!user) {
            next(new APIError({ message: "User not found", status: 200 }));
        }
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            user
        });
    } catch (err) {
        next(new APIError(err));
    }

});

const uploadProfilePic = asyncHandler(async (req, res,next) => {
    try {
        let { entity } = req.user
        
        const user = await User.findById(entity);
        if (!user) {
            next(new APIError({ message: "User not found", status: 200 }));
        }
        if (req.file) {
            const url = `/profile/${req.file.filename}`;
            image = { path: url, name: req.file.filename }
        }
        let _user = { picture: image, updatedBy: entity }
        const updatedUser = await User.findByIdAndUpdate(entity, _user, { new: true });
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            updatedUser
        });
        
    } catch (err) {
        next(new APIError(err));
    }

});

const getUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(404);
        throw new Error("User not found")
    }
    res.status(200).json(user);
});

const createUser = asyncHandler(async (req, res) => {
    const { name } = req.body;
    if (!name) {
        res.status(400)
        throw new Error("User name is required");
    }
    const user = await User.create({ name });
    res.status(201).json(user);
})

const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(404);
        throw new Error("User not found")
    }
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedUser);
})


const deleteUser = asyncHandler(async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            next(new APIError({ message: "Category not found", status: 200 }));
        }
        let _user = await User.findByIdAndDelete(user.id)
        res.status(200).json({
            status: 200,
            user: _user,
            message: "SUCCESS",
        });
    } catch (error) {
        next(new APIError(error));
    }

})


module.exports = { getUsers, getUser, createUser, updateUser, deleteUser, getUserInfo, uploadProfilePic }