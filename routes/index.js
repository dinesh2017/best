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
const router = express.Router();

router.use('/auth', authRoutes)
router.use('/admin', adminRoutes)
router.use('/category', categoryRoutes)
router.use('/tag', tagRoutes)
router.use('/story', storyRoutes)
router.use('/chapter', chapterRoutes)
router.use('/subscription', subscriptionRoutes)
router.use('/subscriber', subscriberRoutes)
router.use('/coupan', coupanRoutes)
router.use('/profile', profileRoutes)


module.exports = router;