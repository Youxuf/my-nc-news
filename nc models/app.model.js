const db = require("../db/connection");

exports.allTopics = () => {
  let sqlQuery = `SELECT * FROM topics `;
  return db.query(sqlQuery).then(({ rows }) => {
    return rows;
  });
};

exports.allArticles = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      return rows[0];
    });
};
