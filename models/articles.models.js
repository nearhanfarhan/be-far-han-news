const db = require("../db/connection");

exports.fetchArticleById = (article_id) => {
  const text = "SELECT * FROM articles WHERE article_id = $1;";
  const params = [article_id];
  return db.query(text, params).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Not found" });
    }
    return rows;
  });
};

exports.fetchAllArticles = (topic, sort_by = "created_at", order = "desc") => {
  const acceptedSorts = [
    "author",
    "title",
    "article_id",
    "created_at",
    "votes",
    "article_img_url",
    "comment_count",
  ];

  const acceptedOrders = ["asc", "desc"];

  if (!acceptedSorts.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  if (!acceptedOrders.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  let text = "";
  const params = [];
  text += `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id)::INTEGER AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id `;

  if (topic) {
    text += `WHERE topic = $1 `;
    params.push(topic);
  }

  text += `GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`;
  return db.query(text, params).then(({ rows }) => {
    return rows;
  });
};

exports.updateArticleVotes = (article_id, inc_votes) => {
  const text =
    "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *";
  const params = [inc_votes, article_id];
  return db.query(text, params).then(({ rows }) => {
    return rows[0];
  });
};
