const express = require('express');
const categoryRoutes = require("./category.route");
const tagRoutes = require("./tag.route");
const storyRoutes = require("./story.route");
const chapterRoutes = require("./chapter.route");
const subscriptionRoutes = require("./subscription.route");
const subscriberRoutes = require("./subscriber.route");
const coupanRoutes = require("./coupan.route");
const profileRoutes = require("./profile.route");
const authRoutes = require("./auth.route");
const adminRoutes = require("./admin.route");
const splashScreenRoutes = require("./splashscreen.route");
const homeRoutes = require("./home.route");
const slidesRoutes = require("./slides.route");
const libraryRoutes = require("./library.route");
const userRoutes = require("./user.route");
const notificationRoutes = require("./notification.route");
const router = express.Router();

router.use('/auth', authRoutes)
router.use('/user', userRoutes)
router.use('/admin', adminRoutes)
router.use('/category', categoryRoutes)
router.use('/tag', tagRoutes)
router.use('/coupan', coupanRoutes)
router.use('/story', storyRoutes)
router.use('/chapter', chapterRoutes)
router.use('/subscription', subscriptionRoutes)
router.use('/subscriber', subscriberRoutes)
router.use('/library', libraryRoutes)
router.use('/profile', profileRoutes)
router.use('/splashscreen', splashScreenRoutes)
router.use('/home', homeRoutes)
router.use('/notification', notificationRoutes)
router.use('/slides', slidesRoutes)


module.exports = router;