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

exports.activateProfile = asyncHandler(async (req, res, next) => {
    try {
        let { entity } = req.user
        if(req.params.id != "all"){
            const profile = await Profile.findById(req.params.id);
            if(!profile){
                next(new APIError({ message: "Profile not found", status: 200 }));
            }
        }
        await Profile.updateMany({ createdBy: entity }, { activeProfile: false });
        if(req.params.id != 'all'){
            const updateProfile = await Profile.findByIdAndUpdate(req.params.id, {activeProfile:true}, { new: true });
        }

        res.status(200).json({
            status: 200,
            message: "SUCCESS"
        });
    } catch (error) {
        next(new APIError(error));
    }
})