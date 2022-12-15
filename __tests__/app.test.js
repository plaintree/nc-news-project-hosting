const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const testData = require("../db/data/test-data/index");

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("3. GET /api/topics", () => {
  it("status:200, should responds with an array of topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toHaveLength(3);

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

  it("status:404, should responds with error message when the path is not found", () => {
    return request(app)
      .get("/api/topicsssssssss")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Route not found");
      });
  });
});

describe("4. GET /api/articles", () => {
  it("status:200, should responds with an array of articles with the creation date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(12);
        expect(articles).toBeSorted("created_at", { descending: true });

        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });

  it("status:404, should responds with error message when the path is not found", () => {
    return request(app)
      .get("/api/articlesssssssss")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Route not found");
      });
  });
});

describe("5 & 11. GET /api/articles/:article_id with comment count", () => {
  it("status:200, should responds with an article object with positive comment count when corresponding comments presence", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toEqual(
          expect.objectContaining({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 100,
            comment_count: 11,
          })
        );
      });
  });
  it("status:200, should responds with an article object with zero comment count when no comments related to the article_id", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toEqual(
          expect.objectContaining({
            article_id: 2,
            author: "icellusedkars",
            title: "Sony Vaio; or, The Laptop",
            topic: "mitch",
            body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
            created_at: "2020-10-16T05:03:00.000Z",
            votes: 0,
            comment_count: 0,
          })
        );
      });
  });

  it("status:400, should responds with error message when article_id is invalid", () => {
    return request(app)
      .get("/api/articles/1e4e")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad Request");
      });
  });

  it("status:404, should responds with error message when article_id does not exist", () => {
    return request(app)
      .get("/api/articles/12345")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Article Not Found");
      });
  });

  it("status:400, should responds with error message when article_id is out of range of type integer", () => {
    return request(app)
      .get("/api/articles/1234523423432423")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Out Of Range For Type Integer");
      });
  });
});

describe("6. GET /api/articles/:article_id/comments", () => {
  it("status:200, should responds with an array of comment objects sorted by most recent comment", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;

        expect(comments).toHaveLength(11);
        expect(comments).toBeSorted("created_at", { descending: true });
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
            })
          );
        });
      });
  });
  it("status:200, should responds with an empty array when article_id exist but without comment", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeInstanceOf(Array);
        expect(comments).toHaveLength(0);
      });
  });

  it("status:404, should responds with error message when the path is not found", () => {
    return request(app)
      .get("/api/articles/1/commentsssssss")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Route not found");
      });
  });

  it("status:400, should responds with error message when article_id is invalid", () => {
    return request(app)
      .get("/api/articles/54etr4e/comments")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad Request");
      });
  });

  it("status:404, should responds with error message when article_id does not exist", () => {
    return request(app)
      .get("/api/articles/12345/comments")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Article Not Found");
      });
  });

  it("status:400, should responds with error message when article_id is out of range of type integer", () => {
    return request(app)
      .get("/api/articles/1234523423432423/comments")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Out Of Range For Type Integer");
      });
  });
});

describe("7. POST /api/articles/:article_id/comments/", () => {
  it("status:200, should responds with the new comment objects if user exists", () => {
    const newPost = {
      username: "butter_bridge",
      body: "test body",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newPost)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            body: expect.any(String),
            article_id: 1,
            author: expect.any(String),
            votes: expect.any(Number),
            created_at: expect.any(String),
          })
        );
      });
  });

  it("status:404, should responds with error message when user does not exists in database but still trying to post comment", () => {
    const newPost = {
      username: "some_random_dude",
      body: "test body",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newPost)
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("User Not Found");
      });
  });

  it("status:400, should responds with error message when req body missing some data", () => {
    const newPost = {
      username: "butter_bridge",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newPost)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Malformed Request Body");
      });
  });

  it("status:400, should responds with error message when article_id is invalid", () => {
    const newPost = {
      username: "butter_bridge",
      body: "test body",
    };
    return request(app)
      .post("/api/articles/54etr4e/comments")
      .send(newPost)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad Request");
      });
  });

  it("status:404, should responds with error message when article_id does not exist", () => {
    const newPost = {
      username: "butter_bridge",
      body: "test body",
    };
    return request(app)
      .post("/api/articles/12345/comments")
      .send(newPost)
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Article Not Found");
      });
  });

  it("status:400, should responds with error message when article_id is out of range of type integer", () => {
    const newPost = {
      username: "butter_bridge",
      body: "test body",
    };
    return request(app)
      .post("/api/articles/1234523423432423/comments")
      .send(newPost)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Out Of Range For Type Integer");
      });
  });
});

describe("8. PATCH /api/articles/:article_id", () => {
  it("status:200, should responds with the update article vote when inc_votes is positive", () => {
    const patchVote = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/1")
      .send(patchVote)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;

        expect(article).toEqual(
          expect.objectContaining({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 101,
          })
        );
      });
  });
  it("status:200, should responds with the update article vote when inc_votes is negative", () => {
    const patchVote = { inc_votes: -10 };
    return request(app)
      .patch("/api/articles/1")
      .send(patchVote)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;

        expect(article).toEqual(
          expect.objectContaining({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 90,
          })
        );
      });
  });
  it("status:200, should responds with the unchanged article vote when inc_votes is zero", () => {
    const patchVote = { inc_votes: 0 };
    return request(app)
      .patch("/api/articles/1")
      .send(patchVote)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;

        expect(article).toEqual(
          expect.objectContaining({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 100,
          })
        );
      });
  });
  it("status:400, should responds with error message vote when inc_votes is invalid", () => {
    const patchVote = { inc_votes: "yo_check_this_out" };
    return request(app)
      .patch("/api/articles/1")
      .send(patchVote)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad Request");
      });
  });
  it("status:400, should responds with error message vote when 'inc_votes' key is missing", () => {
    const patchVote = { inc_votesss: 10 };
    return request(app)
      .patch("/api/articles/1")
      .send(patchVote)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Malformed Request Body");
      });
  });
  it("status:400, should responds with error message when article_id is invalid", () => {
    const patchVote = { inc_votes: 0 };
    return request(app)
      .patch("/api/articles/1r4r")
      .send(patchVote)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad Request");
      });
  });

  it("status:404, should responds with error message when article_id does not exist", () => {
    const patchVote = { inc_votes: 0 };
    return request(app)
      .patch("/api/articles/123")
      .send(patchVote)
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Article Not Found");
      });
  });

  it("status:400, should responds with error message when article_id is out of range of type integer", () => {
    const patchVote = { inc_votes: 0 };
    return request(app)
      .patch("/api/articles/1234523423432423")
      .send(patchVote)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Out Of Range For Type Integer");
      });
  });
});

describe("9. GET /api/users", () => {
  it("status:200, should responds with an array of topics", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toHaveLength(4);

        users.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });

  it("status:404, should responds with error message when the path is invalid", () => {
    return request(app)
      .get("/api/usersssssssss")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Route not found");
      });
  });
});

describe("10. GET /api/articles (queries)", () => {
  it("status:200, should responds with an array of articles with 'sort_by' only query with default descending order", () => {
    return request(app)
      .get("/api/articles?sort_by=author")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(12);
        expect(articles).toBeSorted("author", { descending: true });

        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
  it("status:200, should responds with an array of articles with 'topic' only query with default descending order of date", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(11);
        expect(articles).toBeSorted("created_at", { descending: true });

        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: "mitch",
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
  it("status:200, should responds with an array of articles with 'sort_by' and 'topic' queries with default descending order", () => {
    return request(app)
      .get("/api/articles?sort_by=author&topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(11);
        expect(articles).toBeSorted("author", { descending: true });

        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: "mitch",
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
  it("status:200, should responds with an array of articles with 'sort_by' and 'topic' queries with ascending order", () => {
    return request(app)
      .get("/api/articles?sort_by=title&topic=mitch&order=asc")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(11);
        expect(articles).toBeSorted("title");

        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: "mitch",
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
  it("status:200, should responds with an empty array when 'topic' query is in the database but has no articles", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toHaveLength(0);
      });
  });
  it("status:404, should responds with an error message when 'topic' query does not exist", () => {
    return request(app)
      .get("/api/articles?topic=you_are_beautiful")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Topic Not Found");
      });
  });
  it("status:400, should responds with error message when 'order' query is invalid", () => {
    return request(app)
      .get("/api/articles?order=assscending")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad Request");
      });
  });
  it("status:400, should responds with error message when 'sort_by' or 'order' query is invalid", () => {
    return request(app)
      .get("/api/articles?sort_by=we_do_not_exist&order=assscending")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad Request");
      });
  });
  it("status:400, should responds with error message when the query key is invalid", () => {
    return request(app)
      .get("/api/articles?sort_byyyyyyyy=author&topic=mitch")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad Request");
      });
  });
});

describe("12. DELETE /api/comments/:comment_id", () => {
  it("status:204, should delete a comment with a valid comment_id", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });

  it("status:400, should responds with error message when article_id is invalid", () => {
    return request(app)
      .delete("/api/comments/1e4e")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad Request");
      });
  });

  it("status:404, should responds with error message when article_id does not exist", () => {
    return request(app)
      .delete("/api/comments/12345")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Comment Not Found");
      });
  });

  it("status:400, should responds with error message when comment_id is out of range of type integer", () => {
    return request(app)
      .delete("/api/comments/1234523423432423")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Out Of Range For Type Integer");
      });
  });
});

describe("13. GET /api", () => {
  it("status:200, should responds with an array of topics", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const { pathInfo } = body;
        expect(pathInfo).toEqual(
          expect.objectContaining({
            "GET /api": expect.any(Object),
            "GET /api/topics": expect.any(Object),
            "GET /api/articles": expect.any(Object),
          })
        );
      });
  });
});
