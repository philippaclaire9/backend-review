process.env.NODE_ENV = "test";

const request = require("supertest");
const { expect } = require("chai");
const app = require("../app");
const connection = require("../db/connection");
const chai = require("chai");
chai.use(require("chai-sorted"));

describe("nc_news_api", () => {
  beforeEach(function() {
    return connection.seed.run();
  });
  describe("/api", () => {
    describe("/topics", () => {
      describe("GET", () => {
        it("status 200: will retrieve all topics", () => {
          return request(app)
            .get("/api/topics")
            .expect(200)
            .then(({ body: { topics } }) => {
              expect(topics).to.be.an("array");
              expect(topics.length).to.equal(3);
              expect(topics[0]).to.contain.keys("slug", "description");
            });
        });
      });
    });
    describe("/users", () => {
      describe("GET", () => {
        it("status 200: will retrieve user by id", () => {
          return request(app)
            .get("/api/users/lurker")
            .expect(200)
            .then(({ body: { user } }) => {
              expect(user).to.contain.keys("username", "avatar_url", "name");
              expect(user).to.be.an("object");
            });
        });
        it("status 404: resource does not exist", () => {
          return request(app)
            .get("/api/users/sesame")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("user not found");
            });
        });
      });
    });
    describe("/articles", () => {
      describe("GET", () => {
        it("status 200: responds with array of articles objects", () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.be.an("array");
              expect(articles[0]).to.contain.keys(
                "author",
                "title",
                "article_id",
                "topic",
                "created_at",
                "votes",
                "comment_count"
              );
              expect(articles.length).to.equal(12);
            });
        });
        it("status 200: responds with array of articles objects, sorted by any valid column, default to created_at descending", () => {
          return request(app)
            .get("/api/articles?sort_by=title")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.be.an("array");
              expect(articles[0]).to.contain.keys(
                "author",
                "title",
                "article_id",
                "topic",
                "created_at",
                "votes",
                "comment_count"
              );
              expect(articles).to.be.descendingBy("title");
              expect(articles.length).to.equal(12);
            });
        });
        it("status 200: responds with array of articles objects, sorted by any valid column and ordered, default to created_at descending", () => {
          return request(app)
            .get("/api/articles?sort_by=title&order=asc")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.be.an("array");
              expect(articles[0]).to.contain.keys(
                "author",
                "title",
                "article_id",
                "topic",
                "created_at",
                "votes",
                "comment_count"
              );
              expect(articles).to.be.sortedBy("title");
              expect(articles.length).to.equal(12);
            });
        });
        it("status 200: responds with an array of articles, filtered by author specified in query", () => {
          return request(app)
            .get("/api/articles?author=icellusedkars")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.be.an("array");
              expect(articles[0]).to.contain.keys(
                "author",
                "title",
                "article_id",
                "topic",
                "created_at",
                "votes",
                "comment_count"
              );
              expect(articles).to.be.descendingBy("created_at");
              expect(articles).to.have.lengthOf(6);
            });
        });
        it("status 200: responds with an array of articles, filtered by topic specified in query", () => {
          return request(app)
            .get("/api/articles?topic=mitch")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.be.an("array");
              expect(articles[0]).to.contain.keys(
                "author",
                "title",
                "article_id",
                "topic",
                "created_at",
                "votes",
                "comment_count"
              );
              expect(articles).to.be.descendingBy("created_at");
              expect(articles).to.have.lengthOf(11);
            });
        });

        it("status 200: responds with array of articles, accepting correct query, ignoring nonsense query", () => {
          return request(app)
            .get("/api/articles?sort_by=title&elephants=sparrow")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.be.an("array");
              expect(articles[0]).to.contain.keys(
                "author",
                "title",
                "article_id",
                "topic",
                "created_at",
                "votes",
                "comment_count"
              );
              expect(articles.length).to.equal(12);
              expect(articles).to.be.descendingBy("title");
            });
        });
        it("status 400: when column to be sorted by doesn't exist, returns bad request", () => {
          return request(app)
            .get("/api/articles?sort_by=kangaroos")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Sorry, Bad Request!");
            });
        });
        it("status 200: responds with empty array when no articles exist with the topic queried", () => {
          return request(app)
            .get("/api/articles?topic=paper")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.be.an("array");
              expect(articles).to.have.lengthOf(0);
            });
        });
        it("status 404: when topic does not exist, returns not found", () => {
          return request(app)
            .get("/api/articles?topic=sugar")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Sorry, path not found");
            });
        });
      });
      describe("/:article_id", () => {
        describe("GET", () => {
          it("status 200: will retrieve article by id", () => {
            return request(app)
              .get("/api/articles/9")
              .expect(200)
              .then(({ body: { article } }) => {
                expect(article).to.contain.keys(
                  "article_id",
                  "title",
                  "body",
                  "votes",
                  "topic",
                  "author",
                  "created_at",
                  "comment_count"
                );
                expect(article).to.be.an("object");
                expect(article.comment_count).to.equal("2");
              });
          });
          it("status 404: resource does not exist", () => {
            return request(app)
              .get("/api/articles/99")
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("article not found");
              });
          });
          it("status 400: client entered an invalid article_id", () => {
            return request(app)
              .get("/api/articles/fishfingers")
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Sorry, Bad Request!");
              });
          });
        });
        describe("PATCH", () => {
          it("status 200: will return a treasure with increased votes property", () => {
            return request(app)
              .patch("/api/articles/3")
              .send({ inc_votes: 5 })
              .expect(200)
              .then(({ body: { article } }) => {
                expect(article).to.contain.keys(
                  "article_id",
                  "title",
                  "body",
                  "votes",
                  "topic",
                  "author",
                  "created_at"
                );
                expect(article.votes).to.equal(5);
              });
          });
          it("status 200: will return a treasure with decreased votes property", () => {
            return request(app)
              .patch("/api/articles/3")
              .send({ inc_votes: -5 })
              .expect(200)
              .then(({ body: { article } }) => {
                expect(article).to.contain.keys(
                  "article_id",
                  "title",
                  "body",
                  "votes",
                  "topic",
                  "author",
                  "created_at"
                );
                expect(article.votes).to.equal(-5);
              });
          });
          it("status 200: incorrect key, votes not changed", () => {
            return request(app)
              .patch("/api/articles/1")
              .send({ increase_votes: 5 })
              .expect(200)
              .then(({ body: { article } }) => {
                expect(article.votes).to.equal(100);
              });
          });
          it("status 200: missing key, votes not changed", () => {
            return request(app)
              .patch("/api/articles/3")
              .send({})
              .expect(200)
              .then(({ body: { article } }) => {
                expect(article.votes).to.equal(0);
              });
          });
          it("status 400: incorrect data type on key value", () => {
            return request(app)
              .patch("/api/articles/3")
              .send({ inc_votes: "seven" })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Sorry, Bad Request!");
              });
          });
          it("status 200: unwanted keys on response body, ignores unwanted key and returns increased votes", () => {
            return request(app)
              .patch("/api/articles/3")
              .send({ inc_votes: 2, hello_there: 3 })
              .expect(200)
              .then(({ body: { article } }) => {
                expect(article.votes).to.equal(2);
              });
          });
          it("status 400: incorrect data type for article_id", () => {
            return request(app)
              .patch("/api/articles/harry")
              .send({ inc_votes: 5 })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Sorry, Bad Request!");
              });
          });
          it("status 404: valid data type but non-existent id, returns not found", () => {
            return request(app)
              .patch("/api/articles/1000")
              .send({ inc_votes: 5 })
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Sorry, not found!");
              });
          });
        });

        describe("/comments", () => {
          describe("GET", () => {
            it("status 200: responds with array of comments for given article_id", () => {
              return request(app)
                .get("/api/articles/9/comments")
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments).to.be.an("array");
                  expect(comments[0]).to.contain.keys(
                    "comment_id",
                    "votes",
                    "created_at",
                    "author",
                    "body"
                  );
                });
            });
            it("status 200: responds with array of comments for given article_id sorted by default column created_at", () => {
              return request(app)
                .get("/api/articles/1/comments")
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments).to.be.an("array");
                  expect(comments[0]).to.contain.keys(
                    "comment_id",
                    "votes",
                    "created_at",
                    "author",
                    "body"
                  );
                  expect(comments).to.be.descendingBy("created_at");
                });
            });
            it("status 200: responds with array of comments for given article_id sorted by any column, defaulting to created_at", () => {
              return request(app)
                .get("/api/articles/1/comments?sort_by=votes")
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments).to.be.an("array");
                  expect(comments[0]).to.contain.keys(
                    "comment_id",
                    "votes",
                    "created_at",
                    "author",
                    "body"
                  );
                  expect(comments).to.be.descendingBy("votes");
                });
            });
            it("status 200: responds with array of comments for given article_id sorted by any column, defaulting to created_at, order defaulting to descending", () => {
              return request(app)
                .get("/api/articles/1/comments?sort_by=votes&order=asc")
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments).to.be.an("array");
                  expect(comments[0]).to.contain.keys(
                    "comment_id",
                    "votes",
                    "created_at",
                    "author",
                    "body"
                  );
                  expect(comments).to.be.sortedBy("votes");
                });
            });
            it("status 200: responds with array of comments, accepting correct query, ignoring nonsense query", () => {
              return request(app)
                .get("/api/articles/1/comments?sort_by=votes&elephants=sparrow")
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments).to.be.an("array");
                  expect(comments[0]).to.contain.keys(
                    "comment_id",
                    "votes",
                    "created_at",
                    "author",
                    "body"
                  );
                  expect(comments).to.be.descendingBy("votes");
                });
            });
            it("status 400: when column to be sorted by doesn't exist, returns bad request", () => {
              return request(app)
                .get("/api/articles/1/comments?sort_by=kangaroos")
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal("Sorry, Bad Request!");
                });
            });
            it("status 400: incorrect data type for article_id", () => {
              return request(app)
                .get("/api/articles/harry/comments")
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal("Sorry, Bad Request!");
                });
            });
          });
          describe("POST", () => {
            it("status 201: new comment is created and returned", () => {
              return request(app)
                .post("/api/articles/3/comments")
                .send({
                  username: "butter_bridge",
                  body: "well that's given me food for thought"
                })
                .expect(201)
                .then(({ body: { comment } }) => {
                  expect(comment.body).to.equal(
                    "well that's given me food for thought"
                  );
                  //expect(comment.created_at).to.be.an.instanceof(Date);
                });
            });
            it("status 422: unprocessable entity, username reference does not exist", () => {
              return request(app)
                .post("/api/articles/3/comments")
                .send({
                  username: 1,
                  body: "text here"
                })
                .expect(422)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal("Sorry, unprocessable entity!");
                });
            });
            it("status 400: missing column, returns bad request", () => {
              return request(app)
                .post("/api/articles/3/comments")
                .send({ username: "butter_bridge" })
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal("Sorry, Bad Request!");
                });
            });
            it("status 422: unprocessable entity, article_id reference does not exist", () => {
              return request(app)
                .post("/api/articles/900/comments")
                .send({ username: "butter_bridge", body: "text here" })
                .expect(422)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal("Sorry, unprocessable entity!");
                });
            });
            // it.only("status 400: incorrect data type for article_id", () => {
            //   return request(app)
            //     .patch("/api/articles/harry/comments")
            //     .send({ username: "butter_bridge", body: "text here" })
            //     .expect(400)
            //     .then(({ body: { msg } }) => {
            //       expect(msg).to.equal("Sorry, Bad Request!");
            //     });
            // });
          });
        });
      });
    });
    describe("/comments", () => {
      describe("/:comments_id", () => {
        describe("PATCH", () => {
          it("status 200: responds with a comment with updated vote property", () => {
            return request(app)
              .patch("/api/comments/9")
              .send({ inc_votes: 5 })
              .expect(200)
              .then(({ body: { comment } }) => {
                expect(comment).to.contain.keys(
                  "comment_id",
                  "author",
                  "article_id",
                  "votes",
                  "created_at",
                  "body"
                );
                expect(comment).to.be.an("object");
                expect(comment.votes).to.equal(5);
              });
          });
          it("status 200: incorrect key, votes not changed", () => {
            return request(app)
              .patch("/api/comments/9")
              .send({ increase_votes: 5 })
              .expect(200)
              .then(({ body: { comment } }) => {
                expect(comment.votes).to.equal(0);
              });
          });
          it("status 200: missing key, votes not changed", () => {
            return request(app)
              .patch("/api/comments/9")
              .send({})
              .expect(200)
              .then(({ body: { comment } }) => {
                expect(comment.votes).to.equal(0);
              });
          });
          it("status 400: incorrect data type on key value", () => {
            return request(app)
              .patch("/api/comments/9")
              .send({ inc_votes: "seven" })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Sorry, Bad Request!");
              });
          });
          it("status 400: incorrect data type for comment_id", () => {
            return request(app)
              .patch("/api/comments/nine")
              .send({ inc_votes: 5 })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Sorry, Bad Request!");
              });
          });
          it("status 404: correct data type but non-existent comment_id, returns not found", () => {
            return request(app)
              .patch("/api/comments/1000")
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Sorry, not found");
              });
          });
        });
        describe("DELETE", () => {
          it("status 204: deletes comment by comment_id and returns no content", () => {
            return request(app)
              .delete("/api/comments/1")
              .expect(204);
          });
          it("status 404: deletes comment by comment_id and returns no content", () => {
            return request(app)
              .delete("/api/comments/")
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Sorry, path not found!");
              });
          });
        });
      });
    });
  });
  describe("/*", () => {
    it("status 404: client provides invalid path", () => {
      return request(app)
        .get("/api/invalid")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Sorry, path not found!");
        });
    });
  });
  after(function() {
    return connection.destroy();
  });
});
