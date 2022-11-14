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
  it("should respond with a json object containing a key of topics with a value of an array of all the topics objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((res) => {
        expect(res.body.topics.length).toEqual(3);
      });
  });

  it("should contain the keys of 'slug' and 'description' in each topic", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((res) => {
        res.body.topics.forEach((topic) => {
          expect(Object.keys(topic)).toEqual(["slug", "description"]);
        });
      });
  });

  it("the keys of 'slug' and 'description' should contain values the type of 'string'", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((res) => {
        res.body.topics.forEach((topic) => {
          expect(typeof topic["slug"] && typeof topic["description"]).toBe(
            "string"
          );
        });
      });
  });

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

  it("should ERROR - 404: Path not Found when incorrect path entered", () => {
    return request(app)
      .get("/api/nonsense")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("path not found!");
      });
  });
});
