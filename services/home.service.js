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
const { format } = require('date-fns');
const { PassThrough } = require('stream');
const s3Client = require('../config/s3Client');
const { GetObjectCommand } = require('@aws-sdk/client-s3');

getPlan = async (user)=>{
    const subscriber = await Subscriber.findOne({user:user}).sort({ createdAt: -1 }).populate("subscription user","name duration -_id").select("orderId price discount total orderDate paymentStatus expiryDate -_id");
    const subscription = "";
    if(subscriber){
        var today = new Date();
        const isExpired = today >= subscriber.expiryDate;
        const subscription = subscriber.toObject();
        subscription.isExpired = isExpired;
        subscription.expiryDate = format(subscriber.expiryDate, 'dd-MM-yyyy');
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

function transformFunction(result) {
    if (result) {
        result.transformedVideoUrl = result.videoUrl + '_transformed';
    }
    return result;
}

exports.getHomeData = asyncHandler(async (req, res, next) => {
    try {
        let { entity } = req.user
        const home = await Home.findOne().select("videoUrl popupImage videoImage StoryTypes -_id");
        let modifiedHome = {}
        if(home){
            console.log()
            if(Object.keys(home.videoUrl).length !== 0){
                modifiedHome = {
                    ...modifiedHome,
                    videoUrl: req.protocol + "://" + req.get('host') + "/home/getvideo/" + home.videoUrl.name,
                    videoEnabled : home.videoUrl.isEnable,
                    videoImage : (home.videoImage != undefined)?(req.protocol + "://" + req.get('host')  + home.videoImage.path):""
                };
            }else{
                modifiedHome = {
                    ...modifiedHome,
                    videoUrl: "",
                    videoEnabled : false
                };
            }
            if(home.popupImage.path !== undefined){
                modifiedHome = {
                    ...modifiedHome,
                    popupImage: req.protocol + "://" + req.get('host')  + home.popupImage.path,
                    popupEnabled : home.popupImage.isEnable
                };
            }else{
                modifiedHome = {
                    ...modifiedHome,
                    popupImage: "",
                    popupImage : false
                };
            }
            
        }
        
        const slides = await Slides.find().select("title description action image -_id");
        const user = await User.findById(entity).select("name email gender mobile picture -_id");
        const subscription = await getPlan(entity);
        
        const notification = await Notification.find({ removed: { $nin: [entity] } }).select("title msg type ").limit(10);
        
        const modifiedNotifications = notification.map(doc => {
            doc.id = doc._id;
            delete doc._id;
            return doc;
          });
        let types = home.StoryTypes;
        let options = omitBy({}, isNil);
        let stories = [];
        if(home.StoryTypes != ""){
            const options = { tags: { $in: home.StoryTypes } };
            stories = await Story.find(options).select("name image.path description -_id").limit(10);
        }

        let notificationCount = 0;
        if(modifiedNotifications.length != 0)
            notificationCount = modifiedNotifications.length;
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            homeData: modifiedHome,
            slides : slides,
            profile:(user)?user:"",
            stories : stories,
            subscription,
            notificationCount:notificationCount,
            notificaions:modifiedNotifications
        });

    } catch (error) {
        next(new APIError(error));
    }
})

exports.getHomeVideoById = asyncHandler(async (req, res, next) => {
    try {
        const downloadParams = {
            Bucket: process.env.S3_BUCKET,
            Key: req.params.id,
        };
        const passThroughStream = new PassThrough();
        s3Client.send(new GetObjectCommand(downloadParams))
            .then((data) => {
                data.Body.pipe(passThroughStream);
            })
            .catch((error) => {
                console.error('Error reading audio file from S3:', error);
                res.status(500).send('Internal Server Error');
            });
        res.setHeader('Content-Type', 'audio/mp3');
        res.setHeader('Content-Disposition', 'inline; filename=audio.mp3');

        // Pipe the pass-through stream to the response
        passThroughStream.pipe(res);

        // Handle errors during the streaming process
        passThroughStream.on('error', (error) => {
            console.error('Error streaming audio:', error);
            res.status(500).send('Internal Server Error');
        });

        res.on('finish', () => {
            console.log('Audio playback finished');
        });

        res.on('close', () => {
            // Close the pass-through stream when the response is closed
            passThroughStream.end();
        });
    } catch (error) {
        next(new APIError(error));
    }
})