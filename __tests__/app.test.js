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

describe("GET /api/articles/:article_id", () => {
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

  test("GET:400 sends an appropriate status and error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/article")
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ message: "Bad request" });
      });
  });
});

describe.only("GET /api/articles", () => {
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
