"use strict";
/* global describe it before after */
//http://mongoosejs.com/docs/api.html#Model
const WishList = require("../models/wishlist");
//const WishList = mongoose.model("WishList");
const mongoose = require("mongoose");
const config = require("../config");

const chai = require("chai");
const should = chai.should();
const testResuls = require("./auth.test");

describe("WishList model tests", function() {
  before(function(done) {
    mongoose.connect(config.mongo.url, done);
  });

  it("Create WishList", function(done) {
    //let wl = new WishList();

    console.log(testResuls.TestUserId);

    WishList.create(
      {
        user: "5b066afc8c000c1f302bceb3", //testResuls.TestUserId, //"5b066afc8c409c1f302bceb3",
        categories: [
          {
            name: "Test List"
          }
        ]
      },
      function(err, wl) {
        console.log(wl);
        done();
      }
    );
  });
});
