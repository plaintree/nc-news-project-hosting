const topicsModel = require("../models/topics.model");

exports.getTopics = (req, res, next) => {
  topicsModel
    .getTopicsModel()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};
