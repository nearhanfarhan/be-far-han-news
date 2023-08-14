const db = require("../db/connection");

exports.fetchAllTopics = () => {
  const text = "SELECT * FROM topics;";
  return db.query(text).then(({ rows }) => {
    return rows;
  });
};
