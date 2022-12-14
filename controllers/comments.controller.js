const commentsModel = require("../models/comments.model");

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
