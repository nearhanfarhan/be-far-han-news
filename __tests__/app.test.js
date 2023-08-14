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
        test("GET 404: should return an error for a path that does not exist", () => {
            return request(app).get("/api/teepics").expect(404)

        })
    })
    describe("/api", () => {
        test("GET 200: should return an object describing all available endpoints", () => {
            return request(app).get("/api").expect(200).then(({body})=>{
                const endpoints = Object.keys(body).slice(1) //exclude /api endpoint
                for (i=0; i<endpoints.length; i++){
                    expect(body[endpoints[i]]).toHaveProperty("description")
                    expect(body[endpoints[i]]).toHaveProperty("queries")
                    expect(body[endpoints[i]]).toHaveProperty("exampleResponse")
                }
            })
        })
    })
})