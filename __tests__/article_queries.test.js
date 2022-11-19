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

describe("GET /api/articles", () => {
  it("should respond with a json object containing a key of topics with a value of an array of all the topics objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toEqual(12);
        body.articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number),
          });
        });
      });
  });

  it("should filter by topic when a relevant topic query is added", () => {
    return request(app)
      .get("/api/articles/?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        body.articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: "mitch",
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number),
          });
        });
      });
  });

  it("should sort by queried column when a relevant sort_by query is added", () => {
    return request(app)
      .get("/api/articles/?sort_by=title")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("title", { descending: true });
      });
  });

  it("should order by designated order query", () => {
    return request(app)
      .get("/api/articles/?order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: false });
      });
  });

  it("should order sort and filter by designated  query", () => {
    return request(app)
      .get("/api/articles/?topic=mitch&sort_by=title&order=asc")
      .expect(200)
      .then(({ body }) => {
        body.articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: "mitch",
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number),
          });
        });
        expect(body.articles).toBeSortedBy("title", { descending: false });
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

  it("should ERROR - 400: Invalid sort query! when incorrect sort_by condition entered", () => {
    return request(app)
      .get("/api/articles/?sort_by=moustache_size")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid sort query!");
      });
  });

  it("should ERROR - 400: Invalid order query! when incorrect order condition entered", () => {
    return request(app)
      .get("/api/articles/?order=whiskers")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid order query!");
      });
  });

  it("should 204: No articles found! when non-existent topic condition entered", () => {
    return request(app)
      .get("/api/articles/?topic=facial_hair")
      .expect(404)
      .then(({ body }) => {
        console.log(body, "msg");
        expect(body.msg).toBe("No article found");
      });
  });
});
