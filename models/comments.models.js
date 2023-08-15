const db = require("../db/connection");

exports.fetchCommentsByArticle = (article_id) => {
  const text =
    "SELECT * FROM comments where article_id = $1 ORDER BY created_at DESC;";
  const params = [article_id];
  return db.query(text, params).then(({ rows }) => {
    return rows;
  });
};

exports.insertCommentsByArticle = (article_id, author, body) => {
  const text =
    "INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *";
  const params = [article_id, author, body];
  return db.query(text, params).then((result) => {
    return result.rows[0];
  });
};
