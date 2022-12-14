const db = require("../db/connection");

exports.getArticlesModel = () => {
  let SQL = `SELECT articles.author, title, articles.article_id, 
  topic, articles.created_at, articles.votes, 
  COUNT(comments.article_id):: INTEGER AS comment_count
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id
  GROUP BY articles.article_id
  ORDER BY articles.created_at DESC
  ;
  `;
  return db.query(SQL).then(({ rows }) => rows);
};

exports.checkArticleExists = (article_id) => {
  let SQL = `SELECT article_id FROM articles;`;
  return db.query(SQL).then(({ rows: articleIdList }) => {
    const articleIdArray = articleIdList.map((article) => +article.article_id);
    if (!articleIdArray.includes(+article_id) && article_id <= 2147483647) {
      return Promise.reject({ status: 404, msg: "Article Not Found" });
    }
  });
};

exports.getArticleByIdModel = (article_id) => {
  let SQL = `SELECT * FROM articles WHERE article_id = $1;`;
  return db
    .query(SQL, [article_id])

    .then(({ rows }) => rows[0]);
};

exports.getArticleCommentsModel = (article_id) => {
  let SQL = `SELECT comment_id, body, author, votes, created_at

      FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`;
  return db
    .query(SQL, [article_id])

    .then(({ rows }) => rows);
};

exports.postArticleCommentModel = (newComment, article_id) => {
  const { username, body } = newComment;
  let SQL = `INSERT INTO comments (body,article_id, author) 
      VALUES ($1,$2,$3) 
      RETURNING *;`;
  return db
    .query(SQL, [body, article_id, username])

    .then(({ rows }) => rows[0]);
};
