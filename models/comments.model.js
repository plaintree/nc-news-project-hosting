const db = require("../db/connection");

exports.checkCommentExists = (commentId) => {
  const SQL = `SELECT * FROM comments;`;
  return db.query(SQL).then(({ rows }) => {
    const isExist = rows.some((comment) => +comment.comment_id === +commentId);
    if (!isExist && commentId <= 2147483647) {
      return Promise.reject({
        status: 404,
        msg: "Comment Not Found",
      });
    }
  });
};

exports.patchCommentModel = (voteCount, commentId) => {
  const SQL = `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *;`;
  return db.query(SQL, [voteCount, commentId]).then((data) => {
    return data.rows[0];
  });
};

exports.deleteCommentModel = (commentId) => {
  const SQL = `DELETE FROM comments WHERE comment_id = $1 RETURNING *;`;
  return db.query(SQL, [commentId]).then((data) => {
    return data.rows[0];
  });
};
