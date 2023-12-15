const Home = require("../models/home.model");
const Slides = require("../models/slides.model");
const User = require("../models/auth/user.model");
const Story = require("../models/story.model");
const asyncHandler = require("express-async-handler");
const Tags = require("../models/tags.model");
const APIError = require('../utils/APIError');
const { omitBy, isNil } = require('lodash');

exports.getHomeData = asyncHandler(async (req, res, next) => {
    try {
        let { entity } = req.user
        const home = await Home.findOne().select("videoUrl popupImage StoryTypes -_id");
        const slides = await Slides.find().select("title description action image -_id");
        const user = await User.findById(entity).select("name email gender mobile picture -_id");
        let types = home.StoryTypes;
        let options = omitBy({}, isNil);
        const stories = [];
        if(types.length != 0){
            const promises = types.map(async (tag) => {
                const tagObjects = await Tags.find({ name: { $in: tag } });
                const tagIds = tagObjects.map((tag) => tag._id);
                const options = { tags: { $in: tagIds } };
                // Assuming Story.find returns a promise
                const st = await Story.find(options).select("name image.path description -_id").limit(10);
                return st;
              });
            
              // Wait for all promises to resolve
              const results = await Promise.all(promises);
            
              // Concatenate the results into the stories array
              stories.push(...results);
        }
        
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            homeData: home,
            slides : slides,
            profile:user,
            stories : stories,
            notificationCount:0,
            notificaions:[]
        });

    } catch (error) {
        next(new APIError(error));
    }
})