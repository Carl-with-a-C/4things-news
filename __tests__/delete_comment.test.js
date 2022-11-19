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

describe("DELETE /api/comments/:comment_id", () => {
  it("DELETE - 204 No Content Status: deletes the specified comment from the database and responds with a 204 message", () => {
    return request(app).delete("/api/comments/2").expect(204);
  });
  it("ERROR - 404 Bad Request, when valid but non-existent comment_id entered", () => {
    return request(app)
      .delete("/api/comments/877")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("not found!");
      });
  });

  it("ERROR - 404 Bad Request, when non valid comment_id entered", () => {
    return request(app)
      .delete("/api/comments/purp")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("bad request!");
      });
  });
});
