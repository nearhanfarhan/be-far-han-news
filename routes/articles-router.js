const {
  getAllArticles,
  getArticleById,
  patchArticleVotesById,
  postArticle,
} = require("../controllers/articles.controllers");
const {
  getCommentsByArticle,
  postCommentsByArticle,
} = require("../controllers/comments.controllers");

const articlesRouter = require("express").Router();

articlesRouter
  .route("/")
  .get(getAllArticles)
  .post(postArticle);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleVotesById);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticle)
  .post(postCommentsByArticle);

module.exports = articlesRouter;
