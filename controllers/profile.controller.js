const asyncHandler = require("express-async-handler");
const Profile = require("../models/profile.model");
const APIError = require('../utils/APIError');


const getProfiles = asyncHandler(async (req, res, next) => {
    try {
        const { profile, count, pages } = await Profile.list(req.query);
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            profiles: profile,
            count, pages
        });
    } catch (error) {
        next(new APIError(error));
    }
})

const getProfile = asyncHandler(async (req, res, next) => {
    try {
        const profile = await Profile.get(req.params.id)
        if (!profile) {
            res.status(404);
            throw new Error("Category not found")
        }
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            profile: profile,
        });
    } catch (error) {
        next(new APIError(error));
    }
});

const createProfile = asyncHandler(async (req, res, next) => {
    try {
        const { name, gender, dob, email, age, } = req.body;
        let { entity } = req.user
        let image = "";
        if (!name) {
            next(new APIError({ message: "Please enter required fields", status: 400 }));
        }
        let picture;
        if (req.file) {
            const url = `/profile/${req.file.filename}`;
            picture = { path: url, name: req.file.filename }
        }
        const profile = await Profile.create({ name, gender, dob, email, age, picture, createdBy: entity });
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            profile: profile,
        });
    } catch (error) {
        next(new APIError(error));
    }
})

const updateProfile = asyncHandler(async (req, res, next) => {
    try {
        const profile = await Profile.findById(req.params.id);
        if (!profile) {
            next(new APIError({ message: "Profile not found", status: 200 }));
        }
        const { name, gender, email, dob, age, } = req.body;
        let { entity } = req.user
        if (req.file) {
            const url = `/profile/${req.file.filename}`;
            picture = { path: url, name: req.file.filename }
        }
        let _profile = { name, gender, dob, age, email, picture, updatedBy: entity }
        const updatedProfile = await Profile.findByIdAndUpdate(req.params.id, _profile, { new: true });
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            profile: updatedProfile,
        });
    } catch (error) {
        next(new APIError(error));
    }
})

const deleteProfile = asyncHandler(async (req, res, next) => {
    try {
        const profile = await Profile.findById(req.params.id);
        if (!profile) {
            res.status(404);
            throw new Error("Profile not found")
        }
        await Profile.remove();
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
        });
    } catch (error) {
        next(new APIError(error));
    }
})

module.exports = { getProfiles, getProfile, createProfile, updateProfile, deleteProfile }