const asyncHandler = require("express-async-handler");
const Profile = require("../models/profile.model");


const getProfiles = asyncHandler(async (req, res) => {
    const profile = await Profile.find()
    res.status(200).json(profile);
})

const getProfile = asyncHandler(async (req, res) => {
    const profile = await Profile.findById(req.params.id);
    if (!profile) {
        res.status(404);
        throw new Error("Profile not found")
    }
    res.status(200).json(profile);
});

const createProfile = asyncHandler(async (req, res) => {
    const { name } = req.body;
    if (!name) {
        res.status(400)
        throw new Error("Profile name is required");
    }
    const profile = await Profile.create({ name });
    res.status(201).json(profile);
})

const updateProfile = asyncHandler(async (req, res) => {
    const profile = await Profile.findById(req.params.id);
    if (!profile) {
        res.status(404);
        throw new Error("Profile not found")
    }
    const updatedProfile = await Profile.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedProfile);
})

const deleteProfile = asyncHandler(async (req, res) => {
    const profile = await Profile.findById(req.params.id);
    console.log(profile)
    if (!profile) {
        res.status(404);
        throw new Error("Profile not found")
    }
    await Profile.remove();
    res.status(200).json(profile);
})

module.exports = { getProfiles, getProfile, createProfile, updateProfile, deleteProfile }