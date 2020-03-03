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
    describe.only("/articles", () => {
      describe("GET", () => {
        it("status 200: will retrieve article by id", () => {
          return request(app)
            .get("/api/articles/3")
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
              expect(article).to.be.an("object");
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
        it("status 200: will return a treasure with updated votes property", () => {
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
        //NOW START ERROR HANDLING WITH PATCH REQUEST!!!
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
