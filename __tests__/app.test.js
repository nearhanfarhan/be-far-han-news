const db = require("../db/connection");
const request = require("supertest");
const app = require("../app");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const articles = require("../db/data/test-data/articles");

afterAll(() => {
  return db.end();
});

beforeEach(() => {
  return seed(testData);
});

describe("far-han-news tests", () => {
  describe("/api/topics", () => {
    test("GET 200: should return with an array of topics", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          const { topics } = body;
          expect(topics).toEqual(expect.any(Array));
          expect(topics.length).toBe(3);
          topics.forEach((topic) => {
            expect(topic).toHaveProperty("slug", expect.any(String));
            expect(topic).toHaveProperty("description", expect.any(String));
          });
        });
    });
  });
  describe("ALL /api/badpath", () => {
    test("GET 404: should return a custom error for a path that does not exist", () => {
      return request(app)
        .get("/api/teepics")
        .expect(404)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Not found");
        });
    });
  });
  describe("/api/articles", () => {
    test("GET 200: should respond with array of all article objects with desired columns sorted in descending order by date", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles.length).toBe(13);
          expect(articles).toBeSortedBy("created_at", { descending: true });
          articles.forEach((article) => {
            expect(article).toHaveProperty("author", expect.any(String));
            expect(article).toHaveProperty("title", expect.any(String));
            expect(article).toHaveProperty("topic", expect.any(String));
            expect(article).toHaveProperty("created_at", expect.any(String));
            expect(article).toHaveProperty("votes", expect.any(Number));
            expect(article).toHaveProperty(
              "article_img_url",
              expect.any(String)
            );
            expect(article).toHaveProperty("comment_count", expect.any(String));
          });
        });
    });
  });
  describe("/api/articles/:article_id", () => {
    test("GET 200: should get a valid article by its ID", () => {
      return request(app)
        .get("/api/articles/2")
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          expect(article[0]).toMatchObject({
            article_id: 2,
            title: "Sony Vaio; or, The Laptop",
            topic: "mitch",
            author: "icellusedkars",
            body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
            created_at: "2020-10-16T05:03:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        });
    });
    test("GET 404: should return an error when passed an non existent ID of the correct type", () => {
      return request(app)
        .get("/api/articles/9999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not found");
        });
    });
    test("GET 400: should return an error when passed an ID of the incorrect type", () => {
      return request(app)
        .get("/api/articles/hello")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
  });
  describe("/api", () => {
    test("GET 200: should return an object describing all available endpoints", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          const endpoints = Object.keys(body).slice(1); //exclude /api endpoint
          for (i = 0; i < endpoints.length; i++) {
            expect(body[endpoints[i]]).toHaveProperty("description");
            expect(body[endpoints[i]]).toHaveProperty("queries");
            expect(body[endpoints[i]]).toHaveProperty("exampleResponse");
          }
        });
    });
  });
  describe("/api/articles/:article_id/comments", () => {
    test("GET 200: should respond with an array of comments for the given article_id with most recent comments first", () => {
      const article_id = 1;
      return request(app)
        .get(`/api/articles/${article_id}/comments`)
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(comments.length).toBe(11);
          expect(comments).toBeSortedBy("created_at", { descending: true });
          comments.forEach((comment) => {
            expect(comment).toHaveProperty("comment_id", expect.any(Number));
            expect(comment).toHaveProperty("body", expect.any(String));
            expect(comment).toHaveProperty("article_id", expect.any(Number));
            expect(comment).toHaveProperty("author", expect.any(String));
            expect(comment).toHaveProperty("votes", expect.any(Number));
            expect(comment).toHaveProperty("created_at", expect.any(String));
          });
        });
    });
    test("GET 200: should respond with success and empty array for a valid article_id which does not have any comments", () => {
      const article_id = 7; //article with 0 comments
      return request(app)
        .get(`/api/articles/${article_id}/comments`)
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(comments.length).toBe(0);
        });
    });
    test("POST 201: should create a comment on the associated article for an existing username and respond with the posted comment", () => {
      const article_id = 7;
      const commentToPost = {
        author: "butter_bridge",
        body: "This is the greatest comment of all time",
      };
      return request(app)
        .post(`/api/articles/${article_id}/comments`)
        .send(commentToPost)
        .expect(201)
        .then(({ body }) => {
          const { comment } = body;
          expect(comment).toHaveProperty("article_id", 7);
          expect(comment).toHaveProperty(
            "body",
            "This is the greatest comment of all time"
          );
          expect(comment).toHaveProperty("author", "butter_bridge");
          expect(comment).toHaveProperty("comment_id", 19);
          expect(comment).toHaveProperty("votes", 0);
          expect(comment).toHaveProperty("created_at", expect.any(String));
        });
    });
    test("POST 404: responds with an error message when passed a username which does not exist on the database", () => {
      const article_id = 4;
      const commentToPost = {
        author: "nearhanfarhan",
        body: "This is the greatest comment of all time",
      };
      return request(app)
        .post(`/api/articles/${article_id}/comments`)
        .send(commentToPost)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Username doesn't exist");
        });
    });
    test("POST 400: should respond with error for comment object missing a body", () => {
      const article_id = 3;
      const commentToPost = {
        author: "butter_bridge",
      };
      return request(app)
        .post(`/api/articles/${article_id}/comments`)
        .send(commentToPost)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
    test("POST 400: should respond with error for comment object missing a username", () => {
      const article_id = 3;
      const commentToPost = {
        body: "butter_bridge",
      };
      return request(app)
        .post(`/api/articles/${article_id}/comments`)
        .send(commentToPost)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });

    test("POST 400: should respond with error when given an invalid article_id", () => {
      const article_id = "hello";
      const commentToPost = {
        author: "butter_bridge",
        body: "This is the greatest comment of all time",
      };
      return request(app)
        .post(`/api/articles/${article_id}/comments`)
        .send(commentToPost)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
    test("POST 404: should respond with an error when passed a non existent ID of valid type", () => {
      const article_id = 9999;
      const commentToPost = {
        author: "butter_bridge",
        body: "I can't believe I'm back here again",
      };
      return request(app)
        .post(`/api/articles/${article_id}/comments`)
        .send(commentToPost)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not found");
        });
    });
    test("GET 404: should respond with error for article_id of valid type which does not exist", () => {
      const article_id = 9999;
      return request(app)
        .get(`/api/articles/${article_id}/comments`)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not found");
        });
    });
    test("GET 400: should respond with an error for article_id of invalid type", () => {
      const article_id = "hello";
      return request(app)
        .get(`/api/articles/${article_id}/comments`)
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Bad request");
        });
    });
  });
});
