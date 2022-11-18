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

describe("GET /api/users", () => {
  //should serve an array of all articles
  it("should respond with a json object containing a key of users with a value of an array of all the users objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users.length).toEqual(4);
        body.users.forEach((article) => {
          expect(article).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });

  it("should ERROR - 404: Path not Found when incorrect path entered", () => {
    return request(app)
      .get("/api/nonsense")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("path not found!");
      });
  });
});
