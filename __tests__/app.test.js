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
            expect(article).toHaveProperty("comment_count", expect.any(Number));
          });
        });
    });
    test("GET 200: should accept topic as a filter", () => {
      return request(app)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles.length).toBe(1);
          expect(articles[0]).toHaveProperty("topic", "cats");
        });
    });
    test("GET 200: should sort by specified column and order", () => {
      return request(app)
        .get("/api/articles?sort_by=comment_count&order=asc")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toBeSortedBy("comment_count");
        });
    });
    test("GET 404: should return an error if passed passed a topic which doesn't exist on topic table", () => {
      return request(app)
        .get("/api/articles?topic=bananas&order=asc")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Topic not found");
        });
    });
    test("GET 200: should return 200 if filtered by an existing topic with 0 articles", () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toEqual([]);
        });
    });
    test("GET 400:should return an error if a forbidden sort_by is used", () => {
      return request(app)
        .get("/api/articles?sort_by=bananas")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
    test("GET 400: should return an error if a forbidden order is used", () => {
      return request(app)
        .get("/api/articles?order=bananas")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
    test("POST 201: should add a new article with an existing topic to an existing author", () => {
      const articleToPost = {
        author: "butter_bridge",
        title: "How to make friends",
        body: "get outside and try",
        topic: "paper",
      };
      return request(app)
        .post("/api/articles")
        .send(articleToPost)
        .expect(201)
        .then(({ body }) => {
          const { article } = body;
          expect(article).toMatchObject({
            ...articleToPost,
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700",
          });
        });
    });
    test('POST 404: should return an error when a non-existent username is used', () => {
      const articleToPost = {
        author: "nearhanfarhan",
        title: "How to make friends",
        body: "get outside and try",
        topic: "paper",
      };
      return request(app)
        .post("/api/articles")
        .send(articleToPost)
        .expect(404).then(({body})=>{
          expect(body.msg).toBe("Username doesn't exist")
        })

    });
  });
  describe("/api/articles/:article_id", () => {
    test("GET 200: should get a valid article by its ID", () => {
      return request(app)
        .get("/api/articles/2")
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          expect(article).toMatchObject({
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
    test("GET 200: returned objects should contain comment_count as a column", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          expect(article).toHaveProperty("comment_count");
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
    test("PATCH 201: should update an article on article_id and respond with updated article", () => {
      const article_id = 1;
      const valueToUpdate = { inc_votes: 4 };
      return request(app)
        .patch(`/api/articles/${article_id}`)
        .send(valueToUpdate)
        .expect(201)
        .then(({ body }) => {
          const { article } = body;
          expect(article).toMatchObject({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 104,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        });
    });
    test("PATCH 404: should respond with an error for article_id of valid type which does not exist", () => {
      const article_id = 9999;
      const valueToUpdate = { inc_votes: 5 };
      return request(app)
        .patch(`/api/articles/${article_id}`)
        .send(valueToUpdate)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not found");
        });
    });
    test("PATCH 400: should respond with an error for article_id of invalid type", () => {
      const article_id = "hello";
      const valueToUpdate = {
        inc_votes: 10,
      };
      return request(app)
        .patch(`/api/articles/${article_id}`)
        .send(valueToUpdate)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
    test("PATCH 400: should respond with an error for an update value of invalid type", () => {
      const article_id = 1;
      const valueToUpdate = {
        inc_votes: "banana?",
      };
      return request(app)
        .patch(`/api/articles/${article_id}`)
        .send(valueToUpdate)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
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
  describe("/api/comments/:comment_id", () => {
    test("DELETE 204: should delete selected comment and return no content", () => {
      const comment_id = 1;
      return request(app).delete(`/api/comments/${comment_id}`).expect(204);
    });
    test("DELETE 404: should return an error when given a comment ID which doesn't exist", () => {
      const comment_id = 12345;
      return request(app)
        .delete(`/api/comments/${comment_id}`)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Comment not found");
        });
    });
    test("DELETE 400: should return an error when passed a comment ID of invalid type", () => {
      const comment_id = "bananas";
      return request(app)
        .delete(`/api/comments/${comment_id}`)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
    test("PATCH 201: should update the selected comment and return the updated comment", () => {
      const comment_id = 1;
      const valueToUpdate = { inc_votes: 1000 };
      return request(app)
        .patch(`/api/comments/${comment_id}`)
        .send(valueToUpdate)
        .expect(201)
        .then(({ body }) => {
          const { comment } = body;
          expect(comment).toMatchObject({
            comment_id: 1,
            body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            article_id: 9,
            author: "butter_bridge",
            votes: 1016,
            created_at: "2020-04-06T12:17:00.000Z",
          });
        });
    });
    test("PATCH 404: Should return an error if update of non existent but valid comment_id is attempted", () => {
      const comment_id = 12352434;
      const valueToUpdate = { inc_votes: 1000 };
      return request(app)
        .patch(`/api/comments/${comment_id}`)
        .send(valueToUpdate)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Comment not found");
        });
    });
    test("PATCH 400: should return an error if comment_id of invalid type passed", () => {
      const comment_id = "bananas";
      const valueToUpdate = { inc_votes: 1000 };
      return request(app)
        .patch(`/api/comments/${comment_id}`)
        .send(valueToUpdate)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
    test("PATCH 400: should return an error if update value of invalid type passed", () => {
      const comment_id = "bananas";
      const valueToUpdate = { inc_votes: true };
      return request(app)
        .patch(`/api/comments/${comment_id}`)
        .send(valueToUpdate)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
  });
  describe("/api/users", () => {
    test("GET 200: should respond with an array of objects showing all users", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          const { users } = body;
          expect(users.length).toBe(4);
          users.forEach((user) => {
            expect(user).toHaveProperty("username", expect.any(String));
            expect(user).toHaveProperty("name", expect.any(String));
            expect(user).toHaveProperty("avatar_url", expect.any(String));
          });
        });
    });
  });
  describe("/api/users/:username", () => {
    test("GET 200: should return the user with a correct username", () => {
      const testUser = "rogersop";
      return request(app)
        .get(`/api/users/${testUser}`)
        .expect(200)
        .then(({ body }) => {
          const { user } = body;
          expect(user).toMatchObject({
            username: "rogersop",
            name: "paul",
            avatar_url:
              "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
          });
        });
    });
    test("GET 404: should return an error if passed a username which does not exist", () => {
      const testUser = "nearhanfarhan";
      return request(app)
        .get(`/api/users/${testUser}`)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Username doesn't exist");
        });
    });
  });
});
