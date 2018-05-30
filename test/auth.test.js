"use strict";
/* global describe it before after */
process.env.NODE_ENV = "test";
const vars = require("./vars.test");
const MongoClient = require("mongodb").MongoClient;
const chai = require("chai");
const should = chai.should();
const chaiHttp = require("chai-http");
const server = require("../app");
const config = require("../config");
let db, client;
chai.use(chaiHttp);

describe("Authentication tests", function() {
  before(function(done) {
    MongoClient.connect(config.mongo.url, function(err, _client) {
      should.not.exist(err);
      should.exist(_client);
      client = _client;
      db = client.db();
      done();
    });
  });

  after(function(done) {
    client.close();
    done();
  });

  it("Remove test user if exists", removeUser);

  it("Register user with empty name", function(done) {
    registerShouldFail({ ...vars.testUser, username: "" }, done);
  });

  it("Register user with empty password", function(done) {
    registerShouldFail({ ...vars.testUser, password: "" }, done);
  });

  it("Register user with empty email", function(done) {
    registerShouldFail({ ...vars.testUser, email: "" }, done);
  });

  it("Register test user", function(done) {
    chai
      .request(server)
      .post("/register")
      .set("Cookie", vars.cookie)
      .send(vars.testUser)
      .end((err, res) => {
        should.not.exist(err);
        res.should.have.status(200);
        let user = res.body;
        should.exist(user);
        user.should.have.property("username").eql(vars.testUser.username);
        user.should.have.property("email").eql(vars.testUser.email);
        vars.cookie = res.header["set-cookie"].join(";");
        done();
      });
  });

  it("Check user is logged in", userShouldExists);

  it("Check test user in db", function(done) {
    db
      .collection("users")
      .findOne({ username: vars.testUser.username }, {}, function(err, user) {
        should.not.exist(err);
        should.exist(user);
        user.should.have.property("username").eql(vars.testUser.username);
        user.should.have.property("email").eql(vars.testUser.email);
        vars.testUserId = user._id;
        done();
      });
  });

  it("Logout", logout);

  it("Check user is not logged in", function(done) {
    chai
      .request(server)
      .get("/user")
      .set("Cookie", vars.cookie)
      .end((err, res) => {
        should.not.exist(err);
        res.should.have.status(200);
        should.exist(res.body);
        res.body.should.eql({});
        done();
      });
  });

  it("Login with invalid username", function(done) {
    loginShouldFail({ ...vars.testUser, username: "0" }, done);
  });

  it("Login with invalid password", function(done) {
    loginShouldFail({ ...vars.testUser, password: "0" }, done);
  });

  it("Login with valid credentials", function(done) {
    chai
      .request(server)
      .post("/login")
      .set("Cookie", vars.cookie)
      .send(vars.testUser)
      .end((err, res) => {
        should.not.exist(err);
        res.should.have.status(200);
        let user = res.body;
        should.exist(user);
        user.should.have.property("username").eql(vars.testUser.username);
        user.should.have.property("email").eql(vars.testUser.email);
        done();
      });
  });

  it("Check user is logged in", userShouldExists);

  it("Logout", logout);
});

function removeUser(done) {
  db
    .collection("users")
    .deleteMany({ username: vars.testUser.username }, {}, function(
      err,
      result
    ) {
      should.not.exist(err);
      should.exist(result);
      result.should.have.property("deletedCount");
      done();
    });
}

function registerShouldFail(user, done) {
  chai
    .request(server)
    .post("/register")
    .set("Cookie", vars.cookie)
    .send(user)
    .end((err, res) => {
      should.not.exist(err);
      res.should.have.status(500);
      should.exist(res.body);
      res.body.should.have.property("error");
      res.body.error.should.have.property("status").eql(500);
      res.body.error.should.have.property("message").not.eql("");
      done();
    });
}

function loginShouldFail(user, done) {
  chai
    .request(server)
    .post("/login")
    .set("Cookie", vars.cookie)
    .send(user)
    .end((err, res) => {
      should.not.exist(err);
      res.should.have.status(400);
      should.exist(res.body);
      res.body.should.have.property("error");
      res.body.error.should.have.property("status").eql(400);
      res.body.error.should.have.property("message").not.eql("");
      done();
    });
}

function userShouldExists(done) {
  chai
    .request(server)
    .get("/user")
    .set("Cookie", vars.cookie)
    .end((err, res) => {
      should.not.exist(err);
      res.should.have.status(200);
      let user = res.body;
      should.exist(user);
      user.should.have.property("username").eql(vars.testUser.username);
      user.should.have.property("email").eql(vars.testUser.email);
      done();
    });
}

function logout(done) {
  chai
    .request(server)
    .get("/logout")
    .set("Cookie", vars.cookie)
    .end((err, res) => {
      should.not.exist(err);
      res.should.have.status(200);
      should.exist(res.body);
      res.body.should.have.property("result").eql("success");
      done();
    });
}
