const express = require("express");
const router = express.Router();

const commentsController = require("../controllers/comments.controller");

router.delete("/:comment_id", commentsController.deleteComment);

module.exports = router;
