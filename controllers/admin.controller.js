const asyncHandler = require("express-async-handler");
const Admin = require("../models/auth/admin.model");
const User = require("../models/auth/user.model");
const Subscriber = require("../models/subscriber.model");
const Subscription = require("../models/subscription.model");
const Profile = require("../models/profile.model");
const Story = require("../models/story.model");
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
        let _admin = await Admin.getByMobileOrEmail(email);
        if (_admin == null) {
            return res.status(404).json({
                status: 404,
                message: `User not found`,
            });
        }
        if (await bcrypt.compare(password, _admin.password)) {
            const { admin, accessToken } = await Admin.findAndGenerateTokenByEmail({ email: _admin.email })
            return res.status(200).json({
                status: 200,
                message: "SUCCESS",
                admin,
                accessToken,
            });
        }else{
            return res.status(401).json({
                status: 401,
                message: `The username or password you entered is incorrect..`,
            });
        }
    }catch(err){
        return next(new APIError({ message: `Login Failed` }));
    }
    
})

const geUserDetails = asyncHandler(async (req, res) => {
    let user = await User.get(req.params.id);
    const currentPlan = await Subscriber.findOne({user:req.params.id, activePlan:true}).populate("subscription");
    let UserProfiles = await Profile.find({createdBy:req.params.id}).select('name picture gender age');
    UserProfiles = UserProfiles.map((x)=>{
        let profile ={
            name: x.name,
            age: x.age,
            coverImage: (x.picture)?req.protocol + "://" + req.get('host')  + x.picture.path:"",
            lastaccess: "N/A"
        }
        return profile;
    })
    let profilePicture = picture = (user.picture)?req.protocol + "://" + req.get('host')  + user.picture.path:""
    const Subscribes = await Subscriber.find({user:req.params.id}).populate({
        path:"subscription",
        select:"name duration price"
    }).populate("orderId price paymentStatus createdAt discount total activePlan");
    const FinishedStories = 0;
    const LearningHours = 0;
    const AchievedSkills = 0;
    const SpendingTime = [0,0,0,0,0,0,0,0,0,0,0,0]
    res.status(200).json({
        status: 200,
        message: "SUCCESS",
        user:{
            Profile:user,
            CurrentPlan : (currentPlan)?currentPlan?.subscription.name:"-",
            UserProfiles,
            Subscribes,
            FinishedStories,
            LearningHours,
            AchievedSkills,
            SpendingTime
        }
        
    });
});
const getDashboard = asyncHandler(async (req, res) => {
    const users = await User.find();
    const subscribers = await Subscriber.groupByUser();
    const statistics = await Subscriber.getUserData();
    const userGraph = statistics.map((x)=> {return parseInt(x.totalUsers)})
    const storyCount = await Story.count();
    const {totalSum, lastMonthTotalSum, thisMonthTotalSum} = await Subscriber.getTotalAmount();
    const plans = await Subscription.find();
    const subscriptionGraph = []
    if(plans.length != 0){
        plans.map((plan)=>{
            let data = [];
            statistics.map((x)=>{
                if(x.subscriptions.length != 0){
                    x.subscriptions.map((y)=>{
                        if(y.subscription == plan.name)
                            data.push(y.totalUsers);
                    })
                }else{
                    data.push(0);
                }
            })
            subscriptionGraph.push({name:plan.name, data:data})
        })
    }
    res.status(200).json({
        status: 200,
                message: "SUCCESS",
        dashboard:{
            totalUsers : users.length,
            totalSubscription: subscribers.length,
            totalStories : storyCount,
            totalRevenue : totalSum,
            lastMonth : lastMonthTotalSum,
            thisMonth : thisMonthTotalSum,
            userGraph,
            subscriptionGraph
        }
        
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
    if (!user) {
        res.status(404);
        throw new Error("Admin not found")
    }
    await Admin.remove();
    res.status(200).json(user);
})

module.exports = { getAdmins, getAdmin, createAdmin, updateAdmin, deleteAdmin, getDashboard, login, geUserDetails }