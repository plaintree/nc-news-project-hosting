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
exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  articlesModel
    .getArticlesByIdModel(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
exports.getArticleComments = (req, res, next) => {
  const { article_id } = req.params;
  Promise.all([
    articlesModel.checkArticleExist(article_id),
    articlesModel.getArticleCommentsModel(article_id),
  ])

    .then(([bool, comments]) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};
