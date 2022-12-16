const express = require("express");
const router = express.Router();

const articlesController = require("../controllers/articles.controller");

router.get("/", articlesController.getArticles);
router.get("/:article_id", articlesController.getArticleById);
router.get("/:article_id/comments", articlesController.getArticleComments);

router.post("/:article_id/comments", articlesController.postArticleComment);
router.post("/", articlesController.postArticle);
router.patch("/:article_id", articlesController.patchArticleById);

module.exports = router;
