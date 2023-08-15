const db = require("../db/connection");
const request = require("supertest");
const app = require("../app");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");

afterAll(() => {
  return db.end();
});

beforeEach(() => {
  return seed(testData);
});

describe("far-han-news tests", ()=> {
    describe("/api/topics", () => {
        test("GET 200: should return with an array of topics", () => {
            return request(app).get("/api/topics").expect(200).then(({body})=> {
                const {topics} = body
                expect(topics).toEqual(expect.any(Array))
                expect(topics.length).toBe(3)
                topics.forEach((topic)=>{
                    expect(topic).toHaveProperty("slug", expect.any(String))
                    expect(topic).toHaveProperty("description", expect.any(String))
                })
            })
        })   
    })
    describe("ALL /api/badpath", () => {
        test("GET 404: should return a custom error for a path that does not exist", () => {
            return request(app).get("/api/teepics").expect(404).then(({body}) => {
                const {msg} = body
                expect(msg).toBe("Not found")
            })
        })
    })
    describe("/api/articles", () => {
        test("GET 200: should respond with array of all article objects with desired columns sorted in descending order by date", () => {
            return request(app).get("/api/articles").expect(200).then(({body}) => {
                const {articles} = body
                expect(articles.length).toBe(13)
                expect(articles).toBeSortedBy("created_at", {descending : true})
                
            })
        })
    })
})