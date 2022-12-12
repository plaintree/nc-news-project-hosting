const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const testData = require("../db/data/test-data/index");

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe.only("3. GET /api/topics", () => {
  it("status:200, should responds with an array of topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toBeInstanceOf(Array);

        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });

  it("status:404, should responds with error message when the path is invalid", () => {
    return request(app)
      .get("/api/topicsssssssss")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Route not found");
      });
  });
});
