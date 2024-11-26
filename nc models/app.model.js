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

exports.insertComment = ({username, body, article_id}) => {
  if (!username || !body) {
    return Promise.reject({status:400, msg:"Bad request"});
  }

  const author = username;
  let sqlQuery = `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING * ; `;
  const values = [author, body, article_id];

  return db.query(sqlQuery, values).then(({ rows }) => {
    return rows[0];
  })
}
