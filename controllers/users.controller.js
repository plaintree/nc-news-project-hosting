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
exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  Promise.all([
    usersModel.checkUserExists(username),
    usersModel.getUserByUsernameModel(username),
  ])

    .then(([bool, user]) => {
      res.status(200).send({ user });
    })
    .catch(next);
};
