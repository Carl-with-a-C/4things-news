const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const articleData = require("../db/data/test-data/index");
const userData = require("../db/data/test-data/index");
const request = require("supertest");
const app = require("../app");
const sorted = require("jest-sorted");

beforeEach(() => {
  return seed(articleData, userData);
});

afterAll(() => {
  return db.end();
});

describe("GET /api/articles/:article_id/comments", () => {
  it("should respond with an array of comments for the given article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        body.comments.forEach((comment) => {
          expect(comment.article_id).toBe(1);
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            body: expect.any(String),
            article_id: expect.any(Number),
            author: expect.any(String),
            votes: expect.any(Number),
            created_at: expect.any(String),
          });
        });
      });
  });

  it("should ERROR - 404: Path not Found when a valid but non-existent article_id entered", () => {
    return request(app)
      .get("/api/articles/100/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("comment not found!");
      });
  });

  it("should ERROR - 400: Bad Request when incorrect path entered", () => {
    return request(app)
      .get("/api/articles/Purp/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request!");
      });
  });
});
