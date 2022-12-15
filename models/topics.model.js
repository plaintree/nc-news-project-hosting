const db = require("../db/connection");

exports.getTopicsModel = () => {
  const SQL = `SELECT * FROM topics`;
  return db.query(SQL).then(({ rows }) => rows);
};
