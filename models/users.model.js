const db = require("../db/connection");

exports.checkUserExists = (username) => {
  const SQL = `SELECT username FROM users;`;
  return db.query(SQL).then(({ rows }) => {
    const isExist = rows.some((user) => user.username === username);
    if (!isExist) {
      return Promise.reject({
        status: 404,
        msg: "User Not Found",
      });
    }
  });
};

exports.getUsersModel = () => {
  const SQL = `SELECT * FROM users`;
  return db.query(SQL).then(({ rows }) => rows);
};

exports.getUserByUsernameModel = (username) => {
  const SQL = `SELECT * FROM users WHERE username = $1`;
  return db.query(SQL, [username]).then(({ rows }) => rows[0]);
};
