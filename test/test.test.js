"use strict";
/* global describe it before after */
//http://mongoosejs.com/docs/api.html#Model
const WishList = require("../models/wishlist");
const mongoose = require("mongoose");
const config = require("../config");
const chai = require("chai");
const should = chai.should();
const vars = require("./vars.test");

vars.testUserId = "5b0e3c77483890233c5e09c3";

describe("WishList model tests", function() {
  before(function(done) {
    mongoose.connect(config.mongo.url, done);
  });

  after(function(done) {
    mongoose.disconnect(done);
  });

  it("Create WishList", function(done) {
    //let wl = new WishList();

    //console.log(`vars.TestUserId: ${vars.testUserId}`);

    WishList.create(
      {
        user: vars.testUserId,
        categories: [
          {
            name: "Test List1"
          }
        ]
      },
      function(err, wl) {
        should.not.exist(err);
        should.exist(wl);
        //console.log(wl);
        done();
      }
    );
  });
});
