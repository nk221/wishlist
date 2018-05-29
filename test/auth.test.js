"use strict";
/* global describe it before after */
process.env.NODE_ENV = "test";

const MongoClient = require("mongodb").MongoClient;
const chai = require("chai");
const should = chai.should();
const chaiHttp = require("chai-http");
const server = require("../app");
const config = require("../config");
const test_user = { username: "John", password: "pass", email: "john@smith.com" };
let db;
let client;
let cookie = "";
const testResuls = {};

module.exports = testResuls;

chai.use(chaiHttp);

function removeUser(done) {
  db.collection("users").deleteMany({ username: test_user.username }, {}, function(err, result) {
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
    .set("Cookie", cookie)
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
    .set("Cookie", cookie)
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
    .set("Cookie", cookie)
    .end((err, res) => {
      should.not.exist(err);
      res.should.have.status(200);
      let user = res.body;
      should.exist(user);
      user.should.have.property("username").eql(test_user.username);
      user.should.have.property("email").eql(test_user.email);
      done();
    });
}

function logout(done) {
  chai
    .request(server)
    .get("/logout")
    .set("Cookie", cookie)
    .end((err, res) => {
      should.not.exist(err);
      res.should.have.status(200);
      should.exist(res.body);
      res.body.should.have.property("result").eql("success");
      done();
    });
}

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
    registerShouldFail({ ...test_user, username: "" }, done);
  });

  it("Register user with empty password", function(done) {
    registerShouldFail({ ...test_user, password: "" }, done);
  });

  it("Register user with empty email", function(done) {
    registerShouldFail({ ...test_user, email: "" }, done);
  });

  it("Register test user", function(done) {
    chai
      .request(server)
      .post("/register")
      .set("Cookie", cookie)
      .send(test_user)
      .end((err, res) => {
        should.not.exist(err);
        res.should.have.status(200);
        let user = res.body;
        should.exist(user);
        user.should.have.property("username").eql(test_user.username);
        user.should.have.property("email").eql(test_user.email);
        cookie = res.header["set-cookie"].join(";");
        done();
      });
  });

  it("Check user is logged in", userShouldExists);

  it("Check test user in db", function(done) {
    db.collection("users").findOne({ username: test_user.username }, {}, function(err, user) {
      should.not.exist(err);
      should.exist(user);
      user.should.have.property("username").eql(test_user.username);
      user.should.have.property("email").eql(test_user.email);
      testResuls.TestUserId = user._id;
      done();
    });
  });

  it("Logout", logout);

  it("Check user is not logged in", function(done) {
    chai
      .request(server)
      .get("/user")
      .set("Cookie", cookie)
      .end((err, res) => {
        should.not.exist(err);
        res.should.have.status(200);
        should.exist(res.body);
        res.body.should.eql({});
        done();
      });
  });

  it("Login with invalid username", function(done) {
    loginShouldFail({ ...test_user, username: "0" }, done);
  });

  it("Login with invalid password", function(done) {
    loginShouldFail({ ...test_user, password: "0" }, done);
  });

  it("Login with valid credentials", function(done) {
    chai
      .request(server)
      .post("/login")
      .set("Cookie", cookie)
      .send(test_user)
      .end((err, res) => {
        should.not.exist(err);
        res.should.have.status(200);
        let user = res.body;
        should.exist(user);
        user.should.have.property("username").eql(test_user.username);
        user.should.have.property("email").eql(test_user.email);
        done();
      });
  });

  it("Check user is logged in", userShouldExists);

  it("Logout", logout);

  it("Remove test user", removeUser);

  it("Remove session", function(done) {
    should.exist(cookie);
    cookie.should.not.be.eql("");
    let sid = /connect.sid=s%3A([^\.]+)\./g.exec(cookie)[1];
    should.exist(sid);

    db.collection("sessions").deleteMany({ _id: sid }, function(err, result) {
      should.not.exist(err);
      should.exist(result);
      result.should.have.property("deletedCount").eql(1);
      done();
    });
  });
});
