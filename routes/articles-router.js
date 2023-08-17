const {
  getAllArticles,
  getArticleById,
  patchArticleVotesById,
} = require("../controllers/articles.controllers");
const {
  getCommentsByArticle,
  postCommentsByArticle,
} = require("../controllers/comments.controllers");

const articlesRouter = require("express").Router();

articlesRouter.get("/", getAllArticles);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleVotesById);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticle)
  .post(postCommentsByArticle);

module.exports = articlesRouter;
