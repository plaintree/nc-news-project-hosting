const db = require("../db/connection");

exports.getTopicsModel = () => {
  let SQL = `SELECT * FROM topics`;
  return db.query(SQL).then(({ rows }) => rows);
};
