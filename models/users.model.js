const db = require("../db/connection");

exports.checkUserExists = (username) => {
  let SQL = `SELECT username FROM users;`;
  return db.query(SQL).then(({ rows }) => {
    const usernameArray = rows.map((user) => user.username);
    if (!usernameArray.includes(username)) {
      return Promise.reject({
        status: 404,
        msg: "User Not Found",
      });
    } else return Promise.resolve(rows);
  });
};
