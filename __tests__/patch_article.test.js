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

describe("PATCH /api/articles/:article_id updates vote count on article", () => {
  it("should update the vote key of the article corresponding with the article_id by the value of said vote key. Then respond with 202 accepted and the updated article", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 10 })
      .expect(202)
      .then(({ body }) => {
        expect(body.article.votes).toBe(110);
        expect(body.article).toMatchObject({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
        });
      });
  });

  it("should ERROR - 404: Article not Found when a valid but non-existent article_id entered", () => {
    return request(app)
      .patch("/api/articles/100")
      .send({ inc_votes: 10 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article not found!");
      });
  });

  it("should ERROR - 400: Bad Request when incorrect vote value is entered", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "More" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request!");
      });
  });

  it("should ERROR - 400: Bad Request when incorrect vote key is entered", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ include_votes: 10 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request!");
      });
  });
});
