const express = require("express");
const router = express.Router();

const articlesController = require("../controllers/articles.controller");

router.get("/", articlesController.getArticles);
router.get("/:article_id", articlesController.getArticleById);
router.get("/:article_id/comments", articlesController.getArticleComments);

module.exports = router;
