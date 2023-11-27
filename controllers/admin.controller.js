const asyncHandler = require("express-async-handler");
const Admin = require("../models/auth/admin.model");


const getAdmins = asyncHandler(async (req, res) => {
    const admins = await Admin.find()
    res.status(200).json(admins);
})

const getAdmin = asyncHandler(async (req, res) => {
    const user = await Admin.findById(req.params.id);
    if(!user){
        res.status(404);
        throw new Error("Admin not found")
    }
    res.status(200).json(user);
});

const createAdmin = asyncHandler(async (req, res) => {
    const { name } = req.body;
    if (!name) {
        res.status(400)
        throw new Error("Admin name is required");
    }
    const user = await Admin.create({ name });
    res.status(201).json(user);
})

const updateAdmin = asyncHandler(async (req, res) => {
    const user = await Admin.findById(req.params.id);
    if(!user){
        res.status(404);
        throw new Error("Admin not found")
    }
    const updatedAdmin = await Admin.findByIdAndUpdate(req.params.id, req.body, {new : true});
    res.status(200).json(updatedAdmin);
})

const deleteAdmin = asyncHandler(async (req, res) => {
    const user = await Admin.findById(req.params.id);
    console.log(user)
    if(!user){
        res.status(404);
        throw new Error("Admin not found")
    }
    await Admin.remove();
    res.status(200).json(user);
})

module.exports = { getAdmins, getAdmin, createAdmin, updateAdmin, deleteAdmin }