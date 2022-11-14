const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const topicData = require("../db/data/test-data/index");
const request = require("supertest");
const app = require("../app");
const sorted = require("jest-sorted");

beforeEach(() => {
  return seed(topicData);
});

afterAll(() => {
  return db.end();
});

describe("GET /api/topics", () => {
  //should serve an array of all topics
  it("should return an array", () => {});
});
