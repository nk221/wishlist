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
  before(async function() {
    client = await MongoClient.connect(config.mongo.url);
    db = client.db();
  });

  after(async function() {
    client.close();
  });

  it("Remove test user if exists", removeUser);

  it("Register user with empty name", async function() {
    await registerShouldFail({ ...vars.testUser, username: "" });
  });

  it("Register user with empty password", async function() {
    await registerShouldFail({ ...vars.testUser, password: "" });
  });

  it("Register user with empty email", async function() {
    await registerShouldFail({ ...vars.testUser, email: "" });
  });

  it("Register test user", async function() {
    let res = await chai
      .request(server)
      .post("/register")
      .set("Cookie", vars.cookie)
      .send(vars.testUser);

    res.should.have.status(200);
    let user = res.body;
    should.exist(user);
    user.should.have.property("username").eql(vars.testUser.username);
    user.should.have.property("email").eql(vars.testUser.email);
    vars.cookie = res.header["set-cookie"].join(";");
  });

  it("Check user is logged in", userShouldExists);

  it("Check test user in db", async function() {
    let user = await db.collection("users").findOne({ username: vars.testUser.username });
    should.exist(user);
    user.should.have.property("username").eql(vars.testUser.username);
    user.should.have.property("email").eql(vars.testUser.email);
    vars.testUserId = user._id;
  });

  it("Logout", logout);

  it("Check user is not logged in", async function() {
    let res = await chai
      .request(server)
      .get("/user")
      .set("Cookie", vars.cookie);
    res.should.have.status(200);
    should.exist(res.body);
    res.body.should.eql({});
  });

  it("Login with invalid username", async function() {
    await loginShouldFail({ ...vars.testUser, username: "0" });
  });

  it("Login with invalid password", async function() {
    await loginShouldFail({ ...vars.testUser, password: "0" });
  });

  it("Login with valid credentials", async function() {
    let res = await chai
      .request(server)
      .post("/login")
      .set("Cookie", vars.cookie)
      .send(vars.testUser);
    res.should.have.status(200);
    let user = res.body;
    should.exist(user);
    user.should.have.property("username").eql(vars.testUser.username);
    user.should.have.property("email").eql(vars.testUser.email);
  });

  it("Check user is logged in", userShouldExists);
});

async function removeUser() {
  let res = await db.collection("users").deleteMany({ username: vars.testUser.username });
  should.exist(res);
  res.should.have.property("deletedCount");
}

async function registerShouldFail(user) {
  let res = await chai
    .request(server)
    .post("/register")
    .set("Cookie", vars.cookie)
    .send(user);
  res.should.have.status(500);
  should.exist(res.body);
  res.body.should.have.property("error");
  res.body.error.should.have.property("status").eql(500);
  res.body.error.should.have.property("message").not.eql("");
}

async function loginShouldFail(user) {
  let res = await chai
    .request(server)
    .post("/login")
    .set("Cookie", vars.cookie)
    .send(user);
  res.should.have.status(400);
  should.exist(res.body);
  res.body.should.have.property("error");
  res.body.error.should.have.property("status").eql(400);
  res.body.error.should.have.property("message").not.eql("");
}

async function userShouldExists() {
  let res = await chai
    .request(server)
    .get("/user")
    .set("Cookie", vars.cookie);
  res.should.have.status(200);
  let user = res.body;
  should.exist(user);
  user.should.have.property("username").eql(vars.testUser.username);
  user.should.have.property("email").eql(vars.testUser.email);
}

async function logout() {
  let res = await chai
    .request(server)
    .get("/logout")
    .set("Cookie", vars.cookie);
  res.should.have.status(200);
  should.exist(res.body);
  res.body.should.have.property("result").eql("success");
}
