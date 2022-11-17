const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const testData = require("../db/data/test-data/index");
const request = require("supertest");
const app = require("../app");
const sorted = require("jest-sorted");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("POST /api/articles/:article_id/comments", () => {
  it("should add the comment to the database and respond with a 201 created msg and the posted comment", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "butter_bridge",
        body: "Big boy Barry bonding it up like James doh",
      })
      .expect(201)
      .then((res) => {
        expect(res.body).toMatchObject({ comment: expect.any(String) });
        console.log(res.body.comment);
        expect(res.body.comment).toBe(
          "Big boy Barry bonding it up like James doh"
        );
      });
  });

  it("should ERROR - 404: Article not Found when a valid but non-existent article_id entered", () => {
    return request(app)
      .post("/api/articles/100/comments")
      .send({
        username: "butter_bridge",
        body: "Big boy Barry bonding it up like James doh",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article not found!");
      });
  });

  it("should ERROR - 400: Bad Request when a invalid username is entered", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "Barry Bonds",
        body: "Big boy Barry bonding it up like James doh",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("User does not exist!");
      });
  });

  it("should ERROR - 400: Bad Request when input criteria is not met", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        body: "Big boy Barry bonding it up like James doh",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input criteria!");
      });
  });
});
