const asyncHandler = require("express-async-handler");
const Admin = require("../models/auth/admin.model");
const User = require("../models/auth/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const APIError = require('../utils/APIError');


const getAdmins = asyncHandler(async (req, res) => {
    const admins = await Admin.find()
    res.status(200).json(admins);
})

const login = asyncHandler(async (req, res, next) => {
    try{
        let { email, password } = req.body;
        if (!email && !password) {
            return next(new APIError({ message: `Please enter email and password` }));
        }
        let _user = await User.getByMobileOrEmail("",email);
        if (_user == null) {
            return res.status(200).json({
                status: 404,
                message: `User not found`,
            });
        }
        if (await bcrypt.compare(password, _user.password)) {
            const { user, accessToken } = await User.findAndGenerateTokenByEmail({ email: _user.email })
            return res.status(200).json({
                status: 200,
                message: "SUCCESS",
                user,
                accessToken,
            });
        }else{
            return res.status(200).json({
                status: 401,
                message: `The username or password you entered is incorrect..`,
            });
        }
    }catch(err){
        return next(new APIError({ message: `Login Failed` }));
    }
    
})

const getDashboard = asyncHandler(async (req, res) => {
    const users = await User.findAll();
    res.status(200).json({
        users
    })
});

const getAdmin = asyncHandler(async (req, res) => {
    const user = await Admin.findById(req.params.id);
    if (!user) {
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
    if (!user) {
        res.status(404);
        throw new Error("Admin not found")
    }
    const updatedAdmin = await Admin.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedAdmin);
})

const deleteAdmin = asyncHandler(async (req, res) => {
    const user = await Admin.findById(req.params.id);
    console.log(user)
    if (!user) {
        res.status(404);
        throw new Error("Admin not found")
    }
    await Admin.remove();
    res.status(200).json(user);
})

module.exports = { getAdmins, getAdmin, createAdmin, updateAdmin, deleteAdmin, getDashboard, login }