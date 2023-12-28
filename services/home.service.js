const Home = require("../models/home.model");
const Slides = require("../models/slides.model");
const Notification = require("../models/notification.model");
const User = require("../models/auth/user.model");
const Story = require("../models/story.model");
const asyncHandler = require("express-async-handler");
const Tags = require("../models/tags.model");
const APIError = require('../utils/APIError');
const { omitBy, isNil } = require('lodash');
const Subscriber = require("../models/subscriber.model");

getPlan = async (user)=>{
    const subscriber = await Subscriber.findOne({user:user}).populate("subscription","name -_id").select("orderId price discount total orderDate paymentStatus expiryDate -_id");
    const subscription = null;
    if(subscriber){
        var today = new Date();
        const isExpired = today >= subscriber.expiryDate;
        const subscription = subscriber.toObject();
        subscription.isExpired = isExpired;
        return subscription;
    }else{
        return subscription;
    }
}

exports.getUserPlan = asyncHandler(async (req, res, next) => {
    try {
    let { entity } = req.user
    
    const subscription = await getPlan(entity);
    
    res.status(200).json({
        status: 200,
        message: "SUCCESS",
        subscription
    });

   
} catch (error) {
    next(new APIError(error));
}
});

exports.getHomeData = asyncHandler(async (req, res, next) => {
    try {
        let { entity } = req.user
        const home = await Home.findOne().select("videoUrl popupImage StoryTypes -_id");
        const slides = await Slides.find().select("title description action image -_id");
        const user = await User.findById(entity).select("name email gender mobile picture -_id");
        const subscription = await getPlan(entity);
        const notification = await Notification.find().select("title msg type -_id").limit(10);
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
            subscription,
            notificationCount:0,
            notificaions:notification
        });

    } catch (error) {
        next(new APIError(error));
    }
})