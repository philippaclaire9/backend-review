process.env.NODE_ENV = "test";

const request = require("supertest");
const { expect } = require("chai");
const app = require("../app");
const connection = require("../db/connection");

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
      });
      describe.only("POST", () => {
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
        //it("status 400: incorrect data type on key value", ()=>{
        //return request(app).post("/api/articles/3/comments").send({})
        //})
      });
    });
  });
  describe("/*", () => {
    it("status 404: client provides invalid path", () => {
      return request(app)
        .get("/api/invalid")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Sorry, invalid path!");
        });
    });
  });
  after(function() {
    return connection.destroy();
  });
});