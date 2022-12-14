const db = require("../db/connection");

exports.getArticlesModel = (sort_by = "date", order = "desc", topic) => {
  let SQL = `SELECT articles.author, title, articles.article_id, 
  topic, articles.created_at, articles.votes, 
  COUNT(comments.article_id):: INTEGER AS comment_count
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id 
  `;

  const queryValues = [];

  const validSortBy = [
    "article_id",
    "author",
    "title",
    "topic",
    "date",
    "votes",
    "comment_count",
  ];
  const validOrder = ["asc", "desc"];

  if (!validSortBy.includes(sort_by) || !validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  if (topic !== undefined) {
    SQL += ` WHERE topic = $1 GROUP BY articles.article_id`;
    queryValues.push(topic);
  } else {
    SQL += ` GROUP BY articles.article_id`;
  }

  if (sort_by === "article_id") {
    SQL += ` ORDER BY articles.article_id`;
  } else if (sort_by === "author") {
    SQL += ` ORDER BY articles.author`;
  } else if (sort_by === "title") {
    SQL += ` ORDER BY title`;
  } else if (sort_by === "topic") {
    SQL += ` ORDER BY topic`;
  } else if (sort_by === "comment_count") {
    SQL += ` ORDER BY comment_count`;
  } else if (sort_by === "votes") {
    SQL += ` ORDER BY votes`;
  } else {
    SQL += ` ORDER BY articles.created_at`;
  }

  if (order === "asc") {
    SQL += ` ASC;`;
  } else {
    SQL += ` DESC;`;
  }

  return db.query(SQL, queryValues).then(({ rows }) => rows);
};

exports.checkArticleQueryExists = (reqQuery) => {
  const queryArray = Object.keys(reqQuery);
  const validQuery = ["sort_by", "topic", "order"];
  return new Promise((resolve, reject) => {
    if (queryArray.length === 0) return resolve(true);
    queryArray.forEach((q) => {
      if (!validQuery.includes(q)) {
        return reject({ status: 400, msg: "Bad Request" });
      } else return resolve(true);
    });
  });
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

exports.patchArticleByIdModel = (voteCount, article_id) => {
  let SQL = `UPDATE articles SET votes = votes + $1 
      WHERE article_id = $2
      RETURNING *;`;
  return db
    .query(SQL, [voteCount, article_id])

    .then(({ rows }) => rows[0]);
};
