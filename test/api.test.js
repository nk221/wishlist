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

describe("API tests", function() {
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

  it("Create Wishlist 1", function(done) {
    postWishList(vars.testData[0], done);
  });

  it("Create Wishlist 2", function(done) {
    postWishList(vars.testData[1], done);
  });

  it("Update Wishlist 1", function(done) {
    vars.testData[0].name += " (updated)";
    postWishList(vars.testData[0], done);
  });

  it("Get Wishlists", function(done) {
    chai
      .request(server)
      .get("/wishlist")
      .set("Cookie", vars.cookie)
      .end((err, res) => {
        should.not.exist(err);
        res.should.have.status(200);
        let wishlists = res.body;
        should.exist(wishlists);
        wishlists.should.be.an("array");
        //wishlists.should.have.property("username").eql(vars.testUser.username);
        //wishlists.should.have.property("email").eql(vars.testUser.email);
        //vars.cookie = res.header["set-cookie"].join(";");
        done();
      });
  });
});

function postWishList(wishList, done) {
  chai
    .request(server)
    .post("/wishlist")
    .set("Cookie", vars.cookie)
    .send({
      _id: wishList._id,
      name: wishList.name
    })
    .end((err, res) => {
      should.not.exist(err);
      console.log(res.body);
      res.should.have.status(200);
      let wl = res.body;
      should.exist(wl);
      wl.should.have.property("name").eql(wishList.name);
      wl.should.have.property("_id");
      wishList._id = wl._id;
      done();
    });
}
