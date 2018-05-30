"use strict";
/* global describe it before after */
process.env.NODE_ENV = "test";
const vars = require("./vars.test");
const MongoClient = require("mongodb").MongoClient;
const chai = require("chai");
const should = chai.should();
const chaiHttp = require("chai-http");
const config = require("../config");
let db, client;
chai.use(chaiHttp);

describe("CleanUp", function() {
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

  it("Remove test user", removeUser);

  it("Remove session", function(done) {
    should.exist(vars.cookie);
    let sid = vars.sid();
    should.exist(sid);

    db.collection("sessions").deleteMany({ _id: sid }, function(err, result) {
      should.not.exist(err);
      should.exist(result);
      result.should.have.property("deletedCount").eql(1);
      done();
    });
  });
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
