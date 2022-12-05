const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const testData = require("../db/data/test-data/index");
const request = require("supertest");
const app = require("../app");
const sorted = require("jest-sorted");
const { getArticles } = require("../controllers/getArticles");
const { getTopics } = require("../controllers/getTopics");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

/*-----------ARTICLE_BY_ID------*/

describe("GET /api/articles/:article_id", () => {
  it("should respond with the article that corresponds to the entered article id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article.article_id).toBe(1);
      });
  });

  it("should respond with a json object containing a key of topics with a value of an array of all the topics objects", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          body: expect.any(String),
        });
      });
  });

  it("should ERROR - 404: Path not Found when incorrect path entered", () => {
    return request(app)
      .get("/api/articles/100")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article not found!");
      });
  });

  it("should ERROR - 400: Bad Request when incorrect path entered", () => {
    return request(app)
      .get("/api/articles/Purp")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request!");
      });
  });
});

/*----------ARTICLE_COMMENTS---------*/

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

/*----------ARTICLE_QUERIES---------*/

describe("GET /api/articles", () => {
  it("should respond with a json object containing a key of articles with a value of an array of all the article objects", () => {
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
        expect(body.msg).toBe("No article found");
      });
  });
});

/*------------ARTICLES----------*/

describe("GET /api/articles", () => {
  //should serve an array of all articles
  it("should respond with a json object containing a key of articles with a value of an array of all the articles objects", () => {
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

  it("should be sorted by date in desc order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
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

/*----------PATCH_ARTICLE--------*/

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
        expect(body.msg).toBe("bad request!");
      });
  });

  it("should ERROR - 400: Bad Request when incorrect path entered", () => {
    return request(app)
      .get("/api/articles/Purp")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request!");
      });
  });
});

/*----------POST_COMMENT-------*/

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
        expect(res.body.comment).toMatchObject({
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          author: expect.any(String),
          article_id: expect.any(Number),
          created_at: expect.any(String),
        });
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
        expect(body.msg).toBe("bad request!");
      });
  });

  it("should ERROR - 400: Bad Request when no username is input", () => {
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

  it("should ERROR - 400: Bad Request when no body is input", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "butter_bridge",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input criteria!");
      });
  });
});

/*-------------DELETE_COMMENT-------*/

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

/*------------GET_API----------*/

describe("GET /api", () => {
  it("should Responds with a JSON describing all the available endpoints on the API", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endPoints["GET /api"]).toEqual({
          description:
            "serves up a json representation of all the available endpoints of the api",
        });
      });
  });
});

/*-------------GET_USER-------*/

describe("GET /api/users", () => {
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

/*-----------TOPICS-----------*/

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
