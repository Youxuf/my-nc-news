const db = require("../db/connection");
const { values } = require("../db/data/test-data/articles");

exports.allTopics = () => {
  let sqlQuery = `SELECT * FROM topics `;
  return db.query(sqlQuery).then(({ rows }) => {
    return rows;
  });
};

exports.singleArticle = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.allArticles = () => {
  let sqlQuery = `
  SELECT 
      articles.article_id, 
      articles.title, 
      articles.topic, 
      articles.author, 
      articles.created_at, 
      articles.votes, 
      articles.article_img_url, 
      COUNT(comments.comment_id) AS comment_count
  FROM articles
  LEFT JOIN comments ON comments.article_id = articles.article_id
  GROUP BY articles.article_id
  ORDER BY articles.created_at DESC;
    `;

  return db.query(sqlQuery).then(({ rows }) => {
    return rows;
  });
};

exports.allComments = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1
      ORDER BY comments.created_at DESC`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.insertComment = ({ username, body, article_id }) => {
  if (!username || !body) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  const author = username;
  let sqlQuery = `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING * ; `;
  const values = [author, body, article_id];

  return db.query(sqlQuery, values).then(({ rows }) => {
    return rows[0];
  });
};

exports.updateArticleVotes = ({ article_id, inc_votes }) => {
  const sqlQuery = `
      UPDATE articles
      SET votes = votes + $1
      WHERE article_id = $2
      RETURNING * ;
  `;
  const values = [inc_votes, article_id];

  return db.query(sqlQuery, values).then(({ rows }) => {
    return rows[0];
  });
};

exports.removeComment = (comment_id) => {
  const sqlQuery = `DELETE FROM comments WHERE comment_id = $1 RETURNING * `;
  const values = [comment_id];
  return db.query(sqlQuery, values).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "comment does not exist" });
    }
  });
};
