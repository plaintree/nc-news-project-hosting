const express = require("express");
const router = express.Router();

const topicsController = require("../controllers/topics.controller");

router.get("/", topicsController.getTopics);

module.exports = router;
