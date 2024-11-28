const endpointsJson = require("../endpoints.json");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const data = require("../db/data/test-data");
const app = require("../app");
const request = require("supertest");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end;
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: returns all the topics with the desired categories", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        body.forEach((topic) => {
          expect(body).toHaveLength(3);
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
  test("404: responds with a 'not found' message", () => {
    return request(app)
      .get("/api/route")
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ message: "not found" });
      });
  });
});

describe("/api/articles/:article_id", () => {
  describe("GET", () => {
    test("200: returns a single article with the required properties", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          });
        });
    });

    test("400: sends an appropriate status and error message when given an invalid id", () => {
      return request(app)
        .get("/api/articles/article")
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({ message: "Bad request" });
        });
    });
  });
  describe("PATCH", () => {
    test("200: increments the articles votes by the specified amount", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 1 })
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toMatchObject({
            article_id: 1,
            votes: 101,
          });
        });
    });
    test("200: decrements the articles votes by the specified amount", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: -10 })
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toMatchObject({
            article_id: 1,
            votes: 90,
          });
        });
    });
    test("400: responds with an appropriate status and error message when provided with a invalid input for votes", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: "not" })
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({ message: "Bad request" });
        });
    });
  });
});

describe("GET /api/articles", () => {
  test("200: returns all the articles sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(Array.isArray(articles)).toBe(true);
        expect(articles).toHaveLength(13);
        expect(articles).toBeSortedBy("created_at", { descending: true });

        articles.forEach((article) => {
          expect(article).toMatchObject({
            comment_count: expect.any(String),
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          });
        });
      });
  });
  test("404: responds with a 'not found' message", () => {
    return request(app)
      .get("/api/route")
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ message: "not found" });
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  describe("GET", () => {
    test("200: responds with an array of comments for the given article_id with the required properties", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          const comments = body.comments;
          expect(Array.isArray(comments)).toBe(true);
          expect(comments).toHaveLength(11);
          expect(comments).toBeSortedBy("created_at", { descending: true });

          comments.forEach((comment) => {
            expect(comment).toMatchObject({
              author: expect.any(String),
              comment_id: expect.any(Number),
              article_id: 1,
              created_at: expect.any(String),
              votes: expect.any(Number),
              body: expect.any(String),
            });
          });
        });
    });

    test("200: responds with an empty array ", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).toEqual([]);
        });
    });
    test("404: responds with 'not found' for valid but non-existent article_id", () => {
      return request(app)
        .get("/api/articles/66/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body).toEqual({ message: "not found" });
        });
    });

    test("400: responds with 'Bad request' when article_id is invalid", () => {
      return request(app)
        .get("/api/articles/route/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({ message: "Bad request" });
        });
    });
  });
  describe("POST", () => {
    test("201: responds with the posted comment", () => {
      const newComment = {
        username: "butter_bridge",
        body: "what a wonderful day",
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(201)
        .then(({ body }) => {
          const comment = body.comment;
          expect(comment).toMatchObject({
            author: "butter_bridge",
            body: "what a wonderful day",
            article_id: 1,
            votes: 0,
            created_at: expect.any(String),
            comment_id: expect.any(Number),
          });
        });
    });

    test("400: responds with an appropriate status and error message when provided with a no comment", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          username: "butter_bridge",
        })
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({ message: "Bad request" });
        });
    });
  });
});

describe("DELETE /api/comments/:comment_id,", () => {
  test("204: deletes the comment and send no body back", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("DELETE:404 responds with an appropriate status and error message when given a non-existent id", () => {
    return request(app)
      .delete("/api/comments/999")
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ message: "comment does not exist" });
      });
  });
  test("DELETE:400 responds with an appropriate status and error message when given an invalid id", () => {
    return request(app)
      .delete("/api/comments/not-a-comment")
      .expect(400)
      .then(({body}) => {
        expect(body).toEqual({message:"Bad request"});
      });
  });
});
