const db = require("../db/connection");

exports.getTopicsModel = () => {
  const SQL = `SELECT * FROM topics`;
  return db.query(SQL).then(({ rows }) => rows);
};

exports.checkTopicExists = (topicQuery) => {
  const SQL = `SELECT * FROM topics;`;
  return db.query(SQL).then(({ rows }) => {
    const isExist = rows.some((topic) => topic.slug === topicQuery);
    if (!isExist && topicQuery !== undefined) {
      return Promise.reject({ status: 404, msg: "Topic Not Found" });
    }
  });
};
