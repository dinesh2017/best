const asyncHandler = require("express-async-handler");
const User = require("../models/auth/user.model");


const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find()
    res.status(200).json(users);
})

const getUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if(!user){
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
    if(!user){
        res.status(404);
        throw new Error("User not found")
    }
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {new : true});
    res.status(200).json(updatedUser);
})

const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    console.log(user)
    if(!user){
        res.status(404);
        throw new Error("User not found")
    }
    await User.remove();
    res.status(200).json(user);
})

module.exports = { getUsers, getUser, createUser, updateUser, deleteUser }