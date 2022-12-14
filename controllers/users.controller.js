const usersModel = require("../models/users.model");

exports.getUsers = (req, res, next) => {
  usersModel
    .getUsersModel()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};
