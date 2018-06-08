"use strict";
/* global describe it before after */
process.env.NODE_ENV = "test";
const vars = require("./vars.test");
const MongoClient = require("mongodb").MongoClient;
const chai = require("chai");
const should = chai.should();
const chaiHttp = require("chai-http");
const config = require("../config");
var ObjectId = require("mongoose").Types.ObjectId;
let db, client;
chai.use(chaiHttp);

describe("CleanUp", function() {
  before(async function() {
    client = await MongoClient.connect(config.mongo.url);
    db = client.db();
  });

  after(async function() {
    client.close();
  });

  it.skip("Remove test user's items", async function() {
    removeUserData("items");
  });

  it.skip("Remove test user's categories", async function() {
    removeUserData("categories");
  });

  it.skip("Remove test user's wishlist", async function() {
    removeUserData("wishlists");
  });

  it("Remove test user", removeUser);

  it("Remove session", async function() {
    should.exist(vars.cookie);
    let sid = vars.sid();
    should.exist(sid);

    let result = await db.collection("sessions").deleteMany({ _id: sid });
    should.exist(result);
    result.should.have.property("deletedCount").eql(1);
  });
});

async function removeUser() {
  let result = await db.collection("users").deleteMany({ username: vars.testUser.username });
  should.exist(result);
  result.should.have.property("deletedCount");
}

async function removeUserData(collection) {
  let result = await db.collection(collection).deleteMany({ user: new ObjectId(vars.testUserId) });
  should.exist(result);
  result.should.have.property("deletedCount");
}
