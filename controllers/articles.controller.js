const articlesModel = require("../models/articles.model");

exports.getArticles = (req, res, next) => {
  articlesModel
    .getArticlesModel()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};
