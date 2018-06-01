"use strict";
/* global describe it before after */
//http://mongoosejs.com/docs/api.html#Model
const WishList = require("../models/wishlist");
const Category = require("../models/category");
const Item = require("../models/item");
const mongoose = require("mongoose");
const config = require("../config");
const chai = require("chai");
const should = chai.should();
const vars = require("./vars.test");

//mongoose.set("debug", true);
vars.testUserId = "5b10e3c3cd9ca81110b28970";

let testWishLists = [
  new WishList({
    _id: new mongoose.Types.ObjectId(),
    user: vars.testUserId,
    name: "Test wish list"
  })
];

let testCategories = [
  new Category({
    _id: new mongoose.Types.ObjectId(),
    user: vars.testUserId,
    name: "Test category 1",
    wishlist: testWishLists[0]._id
  }),
  new Category({
    _id: new mongoose.Types.ObjectId(),
    user: vars.testUserId,
    name: "Test category 2",
    wishlist: testWishLists[0]._id
  })
];

let testItems = [
  new Item({
    _id: new mongoose.Types.ObjectId(),
    user: vars.testUserId,
    name: "Test Item 11",
    wishlist: testWishLists[0]._id,
    category: testCategories[0]._id,
    quantity: "one",
    checked: false,
    important: false
  }),
  new Item({
    _id: new mongoose.Types.ObjectId(),
    user: vars.testUserId,
    name: "Test Item 12",
    wishlist: testWishLists[0]._id,
    category: testCategories[0]._id,
    quantity: "two",
    checked: false,
    important: false
  }),
  new Item({
    _id: new mongoose.Types.ObjectId(),
    user: vars.testUserId,
    name: "Test Item 21",
    wishlist: testWishLists[0]._id,
    category: testCategories[1]._id,
    quantity: "one",
    checked: false,
    important: false
  }),
  new Item({
    _id: new mongoose.Types.ObjectId(),
    user: vars.testUserId,
    name: "Test Item 22",
    wishlist: testWishLists[0]._id,
    category: testCategories[1]._id,
    quantity: "two",
    checked: false,
    important: false
  })
];

describe("WishList model tests", function() {
  before(function(done) {
    mongoose.connect(config.mongo.url, done);
  });

  after(function(done) {
    mongoose.disconnect(done);
  });

  it.skip("Clean Up", async function() {
    await Promise.all([WishList.remove({}), Category.remove({}), Item.remove({})]);
  });

  it("Fill with test data", async function() {
    await Promise.all([...testWishLists, ...testCategories, ...testItems].map(x => x.save()));
  });

  it("Select test data", async function() {
    let ww = await WishList.find({}, "_id name")
      .populate({ path: "categories", populate: { path: "items" } })
      .exec();

    should.exist(ww);

    console.log(JSON.stringify(ww[0].toObject({ virtuals: true }), undefined, 2));
  });

  it.skip("Remove test data", async function() {
    await Promise.all(testWishLists.map(wl => wl.remove()));
  });
});
