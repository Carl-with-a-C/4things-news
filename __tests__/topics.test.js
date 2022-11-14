const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const topicData = require("../db/data/test-data/index");
const request = require("supertest");
const app = require("../app");
const sorted = require("jest-sorted");

const { getTopics } = require("../controllers/getTopics");

beforeEach(() => {
  return seed(topicData);
});

afterAll(() => {
  return db.end();
});

describe("GET /api/topics", () => {
  //should serve an array of all topics

  it("should return an array of all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((res) => {
        expect(res.body.topics).toEqual([
          {
            description: "The man, the Mitch, the legend",
            slug: "mitch",
          },
          {
            description: "Not dogs",
            slug: "cats",
          },
          {
            description: "what books are made of",
            slug: "paper",
          },
        ]);
      });
  });
});
