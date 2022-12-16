const express = require("express");
const router = express.Router();

const commentsController = require("../controllers/comments.controller");

router.patch("/:comment_id", commentsController.patchComment);
router.delete("/:comment_id", commentsController.deleteComment);

module.exports = router;
