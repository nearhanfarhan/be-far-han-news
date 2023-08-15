const db = require("../db/connection");

exports.fetchCommentsByArticle = (article_id) => {
    const text = "SELECT * FROM comments where article_id = $1 ORDER BY created_at DESC;"
    const params = [article_id]
    return db.query(text, params).then(({rows}) => {
        return rows
    })
}
