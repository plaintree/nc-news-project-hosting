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

  if (sort_by === "date") {
    SQL += ` ORDER BY articles.created_at`;
  } else {
    SQL += ` ORDER BY articles.${sort_by}`;
  }

  if (order === "asc") {
    SQL += ` ASC;`;
  } else {
    SQL += ` DESC;`;
  }

  return db.query(SQL, queryValues).then(({ rows }) => rows);
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

exports.checkArticleQueryExists = (reqQuery) => {
  const queryArray = Object.keys(reqQuery);
  const validQuery = ["sort_by", "topic", "order"];
  return new Promise((resolve, reject) => {
    if (queryArray.length === 0) return resolve(true);
    queryArray.forEach((query) => {
      if (!validQuery.includes(query)) {
        return reject({ status: 400, msg: "Bad Request" });
      } else return resolve(true);
    });
  });
};

exports.checkArticleExists = (article_id) => {
  const SQL = `SELECT article_id FROM articles;`;
  return db.query(SQL).then(({ rows: articleIdList }) => {
    const articleIdArray = articleIdList.map((article) => +article.article_id);
    if (!articleIdArray.includes(+article_id) && article_id <= 2147483647) {
      return Promise.reject({ status: 404, msg: "Article Not Found" });
    }
  });
};

exports.getArticleByIdModel = (article_id) => {
  const SQL = `SELECT articles.article_id, articles.author, title, 
  topic, articles.author, articles.body, articles.created_at, articles.votes, 
  COUNT(comments.article_id):: INTEGER AS comment_count
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id
  WHERE articles.article_id = $1
  GROUP BY articles.article_id
  ;
  `;
  return db
    .query(SQL, [article_id])

    .then(({ rows }) => rows[0]);
};

exports.getArticleCommentsModel = (article_id) => {
  const SQL = `SELECT comment_id, body, author, votes, created_at
      FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`;
  return db
    .query(SQL, [article_id])

    .then(({ rows }) => rows);
};

exports.postArticleCommentModel = (newComment, article_id) => {
  const { username, body } = newComment;
  const SQL = `INSERT INTO comments (body,article_id, author) 
      VALUES ($1,$2,$3) 
      RETURNING *;`;
  return db
    .query(SQL, [body, article_id, username])

    .then(({ rows }) => rows[0]);
};

exports.patchArticleByIdModel = (voteCount, article_id) => {
  const SQL = `UPDATE articles SET votes = votes + $1 
      WHERE article_id = $2
      RETURNING *;`;
  return db
    .query(SQL, [voteCount, article_id])

    .then(({ rows }) => rows[0]);
};
