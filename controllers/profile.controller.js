const asyncHandler = require("express-async-handler");
const Profile = require("../models/profile.model");


const getProfiles = asyncHandler(async (req, res) => {
    try {
        const profile = await Profile.list(req.query);
        res.status(200).json(profile);
    } catch (err) {
        res.status(500);
        throw new Error(err)
    }
})

const getProfile = asyncHandler(async (req, res) => {
    try {
        const profile = await Profile.get(req.params.id)
        if (!profile) {
            res.status(404);
            throw new Error("Category not found")
        }
        res.status(200).json(profile);
    } catch (err) {
        res.status(500);
        throw new Error(err)
    }
});

const createProfile = asyncHandler(async (req, res) => {
    try {
        const { name, gender, dob, age, } = req.body;
        let { entity } = req.user
        let image = "";
        if (!name) {
            res.status(400)
            throw new Error("Profile name is required");
        }
        if (req.file) {
            const url = `/profile/${req.file.filename}`;
            picture = { path: url, name: req.file.filename }
        }
        const user = await Profile.create({ name, gender, dob, age, picture, createdBy: entity });
        res.status(201).json(user)
    } catch (err) {
        res.status(500);
        throw new Error(err)
    }
})

const updateProfile = asyncHandler(async (req, res) => {
    const profile = await Profile.findById(req.params.id);
    if (!profile) {
        res.status(404);
        throw new Error("Profile not found")
    }
    const { name, gender, dob, age, } = req.body;
    let { entity } = req.user
    if (req.file) {
        const url = `/profile/${req.file.filename}`;
        picture = { path: url, name: req.file.filename }
    }
    let _profile = { name, gender, dob, age, picture, updatedBy: entity }
    const updatedProfile = await Profile.findByIdAndUpdate(req.params.id, _profile, { new: true });
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