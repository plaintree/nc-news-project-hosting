const fs = require("fs/promises");

exports.getApi = (req, res, next) => {
  return fs
    .readFile(`${__dirname}/../endpoints.json`, { encoding: "utf8" })
    .then((data) => {
      res.status(200).send(JSON.parse(data));
    })
    .catch(next);
};
