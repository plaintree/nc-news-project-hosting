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
