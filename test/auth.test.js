/* global describe it before after */
//const should = require("should");
process.env.NODE_ENV = "test";

const chai = require("chai");
const should = chai.should();
let chaiHttp = require("chai-http");
let server = require("../app");

const mongoose = require("mongoose");
const config = require("../config");
const User = require("../auth/models/user");

let test_user = { username: "John", password: "pass", email: "john@smith.com" };
chai.use(chaiHttp);

function removeUser(done) {
  User.findOne({ username: test_user.username }, function(err, user) {
    should.not.exist(err);
    if (user) {
      User.remove(user, function() {
        done();
      });
    } else done();
  });
}

function registerShouldFail(user, done) {
  chai
    .request(server)
    .post("/register")
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

describe("Authentication tests", function() {
  before(function(done) {
    mongoose.connect(config.mongo.url, done);
  });

  after(function(done) {
    mongoose.connection.close();
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

  it("Check test user in db", function(done) {
    User.findOne({ username: test_user.username }, function(err, user) {
      should.not.exist(err);
      should.exist(user);
      user.should.have.property("username").eql(test_user.username);
      user.should.have.property("email").eql(test_user.email);
      done();
    });
  });

  it("Login with invalid username", function(done) {
    loginShouldFail({ ...test_user, username: "0" }, done);
  });

  it("Login with invalid password", function(done) {
    loginShouldFail({ ...test_user, password: "0" }, done);
  });

  it("Remove test user", removeUser);
});
