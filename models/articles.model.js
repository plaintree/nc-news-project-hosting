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
    } else return Promise.resolve(articleIdList);
  });
};

exports.getArticleByIdModel = (article_id) => {
  let SQL = `SELECT * FROM articles WHERE article_id = $1;`;
  return db
    .query(SQL, [article_id])

    .then(({ rows }) => rows[0]);
};
