const db = require("../db/connection");

exports.fetchAllTopics = () => {
  const text = "SELECT * FROM topics;";
  return db.query(text).then(({ rows }) => {
    return rows;
  });
};

exports.fetchTopic = (topic_name) => {
  let text = "";
  const params = [];
  text += "SELECT * FROM topics";
  if (topic_name) {
    text += " WHERE slug = $1";
    params.push(topic_name);
  }
  text += ";";
  return db.query(text, params).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Topic not found" });
    }
    return rows;
  });
};

exports.insertTopic = (slug, description) => {
  let text = "";
  let params = [slug];

  text += "INSERT INTO topics (slug";
  if (description) {
    params.push(description);
    text += ", description";
  }
  text += ") VALUES ($1";
  if (description) {
    text += ", $2";
  }
  text += ") RETURNING *;";

  return db.query(text, params).then(({ rows }) => {
    return rows[0];
  });
};
