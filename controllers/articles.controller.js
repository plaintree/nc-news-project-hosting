const articlesModel = require("../models/articles.model");
const usersModel = require("../models/users.model");

exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic } = req.query;
  Promise.all([
    articlesModel.checkArticleQueryExists(req.query),
    articlesModel.checkTopicExists(topic),
    articlesModel.getArticlesModel(sort_by, order, topic),
  ])
    .then(([articleBool, topicBool, articles]) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};
exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  Promise.all([
    articlesModel.checkArticleExists(article_id),
    articlesModel.getArticleByIdModel(article_id),
  ])

    .then(([articleIdList, article]) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
exports.getArticleComments = (req, res, next) => {
  const { article_id } = req.params;
  Promise.all([
    articlesModel.checkArticleExists(article_id),
    articlesModel.getArticleCommentsModel(article_id),
  ])
    .then(([articleIdList, comments]) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};
exports.postArticleComment = (req, res, next) => {
  const {
    body,
    params: { article_id },
  } = req;
  Promise.all([
    articlesModel.checkArticleExists(article_id),
    usersModel.checkUserExists(body.username),
    articlesModel.postArticleCommentModel(body, article_id),
  ])
    .then(([article_id, username, comment]) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
exports.patchArticleById = (req, res, next) => {
  const {
    body: { inc_votes },
    params: { article_id },
  } = req;
  Promise.all([
    articlesModel.checkArticleExists(article_id),
    articlesModel.patchArticleByIdModel(inc_votes, article_id),
  ])
    .then(([article_id, article]) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
