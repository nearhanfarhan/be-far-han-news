const db = require("../db/connection");

exports.fetchArticleById = (article_id) => {
  const text = "SELECT * FROM articles WHERE article_id = $1;";
  const params = [article_id];
  return db.query(text, params).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 400, msg: "Bad request" });
    }
    return rows;
  });
};
