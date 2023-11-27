const express = require("express");
const router = express.Router();
const { getStories, getStory, createStory, updateStory, deleteStory } = require("../controllers/story.controller");

router.route("/").get(getStories).post(createStory);

router.route("/:id").get(getStory).put(updateStory).delete(deleteStory);

module.exports = router;