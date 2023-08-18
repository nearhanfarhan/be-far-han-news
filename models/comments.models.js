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

exports.removeCommentById = (comment_id) => {
  const text = "DELETE FROM comments WHERE comment_id = $1 RETURNING*";
  const params = [comment_id];
  return db.query(text, params).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Comment not found" });
    }
    return Promise.resolve();
  });
};

exports.updateCommentById = (comment_id, inc_votes) => {
  const text =
    "UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *;";
  const params = [inc_votes, comment_id];
  return db.query(text, params).then(({ rows }) => {
    return rows[0];
  });
};

exports.fetchCommentById = (comment_id) => {
  const text = "SELECT * FROM comments WHERE comment_id = $1;"
  const params = [comment_id]
  return db.query(text,params).then(({rows}) => {
    if (rows.length ===0) {
      return Promise.reject({status:404, msg:"Comment not found"})
    }
    return rows[0]
  })
}