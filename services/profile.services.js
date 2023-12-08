const Profile = require("../models/profile.model");
const asyncHandler = require("express-async-handler");
const APIError = require('../utils/APIError');

exports.getProfilesByUser = asyncHandler(async (req, res, next) => {
    try {

        let { entity } = req.user
        req.query.createdBy = entity
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