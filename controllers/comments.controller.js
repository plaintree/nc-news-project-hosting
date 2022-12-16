const commentsModel = require("../models/comments.model");

exports.patchComment = (req, res, next) => {
  const {
    body: { inc_votes },
    params: { comment_id },
  } = req;
  Promise.all([
    commentsModel.checkCommentExists(comment_id),
    commentsModel.patchCommentModel(inc_votes, comment_id),
  ])
    .then(([bool, comment]) => {
      res.status(200).send({ comment });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  Promise.all([
    commentsModel.checkCommentExists(comment_id),
    commentsModel.deleteCommentModel(comment_id),
  ])
    .then(() => {
      res.sendStatus(204);
    })
    .catch((err) => {
      next(err);
    });
};
