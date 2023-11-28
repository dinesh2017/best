const Profile = require("../models/profile.model");
const asyncHandler = require("express-async-handler");

exports.getProfilesByUser = asyncHandler(async (req, res, next) => {
    try {
        
        let { entity } = req.user
        req.query.createdBy = entity
        const profiles = await Profile.list(req.query);
        res.status(200).json(profiles);
    } catch (err) {
        res.status(500)
        throw new Error(err)
    }
})