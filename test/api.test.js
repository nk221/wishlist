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
    MongoClient.connect(
      config.mongo.url,
      function(err, _client) {
        should.not.exist(err);
        should.exist(_client);
        client = _client;
        db = client.db();
        done();
      }
    );
  });

  after(function(done) {
    client.close();
    done();
  });

  it("Create Wishlist 1", function(done) {
    postWishList(vars.testData[0], done, wishListCheckSuccess);
  });

  it("Create Wishlist 2", function(done) {
    postWishList(vars.testData[1], done, wishListCheckSuccess);
  });

  it("Update Wishlist 1", function(done) {
    vars.testData[0].name += " (updated)";
    postWishList(vars.testData[0], done, wishListCheckSuccess);
  });

  it("Update Wishlist with wrong id", function(done) {
    postWishList({ ...vars.testData[0], _id: "000000b72833550fb8932f16" }, done, checkFailed);
  });

  it("Update Wishlist with empty name", function(done) {
    postWishList({ ...vars.testData[0], name: "" }, done, checkFailed);
  });

  it("Create Category 1", function(done) {
    postCategory(vars.testData[0].categories[0], done, categoryCheckSuccess);
  });

  it("Create Category 2", function(done) {
    postCategory(vars.testData[0].categories[1], done, categoryCheckSuccess);
  });

  it("Get all Wishlists", function(done) {
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
        wishlists.length.should.be.eql(2);
        wishlists.map(wl1 => {
          let wls = vars.testData.filter(wl => wl._id === wl1._id);
          wls.length.should.be.eql(1);
          compareWishLists(wl1, wls[0]).should.be.eql(true);
        });
        done();
      });
  });

  it("Delete Category 1", function(done) {
    deleteData(`/category/${vars.testData[0].categories[0]._id}`, done, checkSuccess);
  });

  it("Delete Category with wrong id", function(done) {
    deleteData(`/category/5b0d44bde3d7191b2c9c0000`, done, checkFailed);
  });

  it("Delete Wishlist 1", function(done) {
    deleteData(`/wishlist/${vars.testData[0]._id}`, done, checkSuccess);
  });

  it("Delete Wishlist 2", function(done) {
    deleteData(`/wishlist/${vars.testData[1]._id}`, done, checkSuccess);
  });

  it("Delete Wishlist with wrong id", function(done) {
    deleteData(`/wishlist/5b0d44bde3d7191b2c9c0000`, done, checkFailed);
  });
});

function compareWishLists(wl1, wl2, deep) {
  if (wl1._id !== wl2._id || wl1.name !== wl2.name) return false;

  if (!deep) return true;

  if (!wl1.categories && !wl2.categories) return true;
  if ((!wl1.categories && wl2.categories) || (wl1.categories && !wl2.categories)) return false;
  if (wl1.categories.length != wl2.categories.length) return false;

  let failed = wl1.categories.some(c1 => {
    let cats = wl2.categories.filter(cat => cat._id == c1._id);
    if (cats.length != 1) return true;

    if (!compareCategories(c1, cats[0])) return true;
  });

  return failed;
}

function compareCategories(c1, c2) {
  if (c1._id !== c2._id || c1.name !== c2.name || c1.name !== c2.sort) return false;

  if (!c1.items && !c2.items) return true;
  if ((!c1.items && c2.items) || (c1.items && !c2.items)) return false;
  if (c1.items.length != c2.items.length) return false;

  let failed = c1.items.some(i1 => {
    let items = c2.items.filter(item => item._id == i1._id);
    if (items.length != 1) return true;

    if (!compareItems(i1, items[0])) return true;
  });

  return failed;
}

function compareItems(i1, i2) {
  return (
    i1._id === i2._id &&
    i1.quantity === i2.quantity &&
    i1.checked === i2.checked &&
    i1.important === i2.important
  );
}

function wishListCheckSuccess(wishList, err, res, done) {
  should.not.exist(err);
  res.should.have.status(200);
  let wl = res.body;
  should.exist(wl);
  wl.should.have.property("name").eql(wishList.name);
  wl.should.have.property("_id");
  wishList._id = wl._id;
  wishList.categories.map(cat => {
    cat.wishlist = wl._id;
    cat.items.map(i => (i.wishlist = wl._id));
  });
  done();
}

function categoryCheckSuccess(category, err, res, done) {
  should.not.exist(err);
  res.should.have.status(200);
  let cat = res.body;
  should.exist(cat);
  cat.should.have.property("name").eql(category.name);
  cat.should.have.property("sort").eql(category.sort);
  cat.should.have.property("_id");
  category._id = cat._id;
  category.items.map(i => (i.category = category._id));
  done();
}

function checkFailed(o, err, res, done) {
  should.not.exist(err);
  res.should.have.status(400);
  let { error } = res.body;
  should.exist(error);
  error.should.have.property("status").eql(400);
  error.should.have.property("message");
  done();
}

function checkSuccess(o, err, res, done) {
  should.not.exist(err);
  res.should.have.status(200);
  let result = res.body;
  should.exist(result);
  result.should.have.property("success").eql(true);
  done();
}

function postWishList(wishList, done, resultChecker) {
  chai
    .request(server)
    .post("/wishlist")
    .set("Cookie", vars.cookie)
    .send({
      _id: wishList._id,
      name: wishList.name
    })
    .end((err, res) => {
      resultChecker(wishList, err, res, done);
    });
}

function postCategory(category, done, resultChecker) {
  chai
    .request(server)
    .post("/category")
    .set("Cookie", vars.cookie)
    .send({
      _id: category._id,
      wishlist: category.wishlist,
      name: category.name,
      sort: category.sort
    })
    .end((err, res) => {
      resultChecker(category, err, res, done);
    });
}

function deleteData(url, done, resultChecker) {
  chai
    .request(server)
    .delete(url)
    .set("Cookie", vars.cookie)
    .end((err, res) => {
      resultChecker(null, err, res, done);
    });
}
