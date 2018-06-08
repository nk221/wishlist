"use strict";
/* global describe it */
process.env.NODE_ENV = "test";
const vars = require("./vars.test");
const chai = require("chai");
const should = chai.should();
const chaiHttp = require("chai-http");
const server = require("../app");
chai.use(chaiHttp);

describe("API tests", function() {
  it("Unauthorized should failed", async function() {
    let res = await chai.request(server).get("/wishlist");
    res.should.have.status(403);
  });

  it("Create Wishlists", async function() {
    await Promise.all(vars.testData.map(wl => postWishList(wl, wishListCheckSuccess)));
  });

  it("Update Wishlist", async function() {
    vars.testData[0].name += " (updated)";
    await postWishList(vars.testData[0], wishListCheckSuccess);
  });

  it("Update Wishlist with wrong id", async function() {
    await postWishList({ ...vars.testData[0], _id: "000000b72833550fb8932f16" }, checkFailed);
  });

  it("Update Wishlist with empty name", async function() {
    await postWishList({ ...vars.testData[0], name: "" }, checkFailed);
  });

  it("Create Categories", async function() {
    let cats = [];
    vars.testData.forEach(wl => {
      wl.categories.forEach(cat => {
        cats.push(cat);
      });
    });

    await Promise.all(cats.map(c => postCategory(c, categoryCheckSuccess)));
  });

  it("Update Category", async function() {
    vars.testData[0].categories[0].name += " (updated)";
    await postCategory(vars.testData[0].categories[0], categoryCheckSuccess);
  });

  it("Update Category with wrong id", async function() {
    await postCategory(
      { ...vars.testData[0].categories[0], _id: "000000b72833550fb8932f16" },
      checkFailed
    );
  });

  it("Update Category with empty name", async function() {
    await postCategory({ ...vars.testData[0].categories[0], name: "" }, checkFailed);
  });

  it("Create Items", async function() {
    let items = [];
    vars.testData.forEach(wl => {
      wl.categories.forEach(cat => {
        cat.items.forEach(item => {
          items.push(item);
        });
      });
    });

    await Promise.all(items.map(i => postItem(i, itemCheckSuccess)));
  });

  it("Update Item", async function() {
    let item = vars.testData[0].categories[0].items[0];
    item.name += " (updated)";
    await postItem(item, itemCheckSuccess);
  });

  it("Update Item with wrong id", async function() {
    await postItem(
      { ...vars.testData[0].categories[0].items[0], _id: "000000b72833550fb8932f16" },
      checkFailed
    );
  });

  it("Update Item with empty checked", async function() {
    await postItem({ ...vars.testData[0].categories[0].items[0], checked: undefined }, checkFailed);
  });

  it("Update Item with empty important", async function() {
    await postItem(
      { ...vars.testData[0].categories[0].items[0], important: undefined },
      checkFailed
    );
  });

  it("Get list of Wishlists", async function() {
    let res = await chai
      .request(server)
      .get("/wishlist")
      .set("Cookie", vars.cookie);

    res.should.have.status(200);
    let wishlists = res.body;
    should.exist(wishlists);
    wishlists.should.be.an("array");
    wishlists.length.should.be.eql(vars.testData.length);

    wishlists.forEach(wl1 => {
      let wls = vars.testData.filter(wl => wl._id === wl1._id);
      wls.length.should.be.eql(1);
      compareWishLists(wl1, wls[0]).should.be.eql(true);
    });
  });

  it("Compare all Wishlists", async function() {
    let results = await Promise.all(
      vars.testData.map(wl => {
        return chai
          .request(server)
          .get(`/wishlist/${wl._id}`)
          .set("Cookie", vars.cookie);
      })
    );

    results.forEach(res => {
      res.should.have.status(200);
      let { body: wishlists } = res;
      wishlists.should.be.an("array");
      wishlists.length.should.be.eql(1);

      let wls = vars.testData.filter(w => w._id === wishlists[0]._id);
      wls.length.should.be.eql(1);
      compareWishLists(wishlists[0], wls[0], true).should.be.eql(true);
    });
  });

  it("Delete Item", async function() {
    await deleteData(`/item/${vars.testData[0].categories[0].items[0]._id}`, checkSuccess);
  });

  it("Delete Item with wrong id", async function() {
    await deleteData(`/item/5b0d44bde3d7191b2c9c0000`, checkFailed);
  });

  it("Delete Category", async function() {
    await deleteData(`/category/${vars.testData[0].categories[0]._id}`, checkSuccess);
  });

  it("Delete Category with wrong id", async function() {
    await deleteData(`/category/5b0d44bde3d7191b2c9c0000`, checkFailed);
  });

  it("Delete Wishlists", async function() {
    await Promise.all(vars.testData.map(wl => deleteData(`/wishlist/${wl._id}`, checkSuccess)));
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

  return !failed;
}

function compareCategories(c1, c2) {
  if (c1._id !== c2._id || c1.name !== c2.name || c1.sort !== c2.sort) return false;

  if (!c1.items && !c2.items) return true;
  if ((!c1.items && c2.items) || (c1.items && !c2.items)) return false;
  if (c1.items.length != c2.items.length) return false;

  let failed = c1.items.some(i1 => {
    let items = c2.items.filter(item => item._id == i1._id);
    if (items.length != 1) return true;

    if (!compareItems(i1, items[0])) return true;
  });

  return !failed;
}

function compareItems(i1, i2) {
  return (
    i1._id === i2._id &&
    i1.name === i2.name &&
    i1.quantity === i2.quantity &&
    i1.checked === i2.checked &&
    i1.important === i2.important
  );
}

function wishListCheckSuccess(wishList, res) {
  if (res.status !== 200) console.log(res.body);
  res.should.have.status(200);
  let wl = res.body;
  should.exist(wl);
  wl.should.have.property("name").eql(wishList.name);
  wl.should.have.property("_id");
  wishList._id = wl._id;
  wishList.categories.forEach(cat => {
    cat.wishlist = wl._id;
    cat.items.forEach(i => (i.wishlist = wl._id));
  });
}

function categoryCheckSuccess(category, res) {
  if (res.status !== 200) console.log(res.body);
  res.should.have.status(200);
  let cat = res.body;
  should.exist(cat);
  cat.should.have.property("wishlist").eql(category.wishlist);
  cat.should.have.property("name").eql(category.name);
  cat.should.have.property("sort").eql(category.sort);
  cat.should.have.property("_id");
  category._id = cat._id;
  category.items.forEach(i => (i.category = category._id));
}

function itemCheckSuccess(item, res) {
  if (res.status !== 200) console.log(res.body);
  res.should.have.status(200);
  let i = res.body;
  should.exist(i);
  i.should.have.property("wishlist").eql(item.wishlist);
  i.should.have.property("category").eql(item.category);
  i.should.have.property("name").eql(item.name);
  i.should.have.property("quantity").eql(item.quantity);
  i.should.have.property("checked").eql(item.checked);
  i.should.have.property("important").eql(item.important);
  i.should.have.property("_id");
  item._id = i._id;
}

function checkFailed(o, res) {
  res.should.have.status(400);
  let { error } = res.body;
  should.exist(error);
  error.should.have.property("status").eql(400);
  error.should.have.property("message");
}

function checkSuccess(o, res) {
  if (res.status !== 200) console.log(res.body);
  res.should.have.status(200);
  let result = res.body;
  should.exist(result);
  result.should.have.property("success").eql(true);
}

async function postItem(item, resultChecker) {
  let res = await chai
    .request(server)
    .post("/item")
    .set("Cookie", vars.cookie)
    .send({
      _id: item._id,
      wishlist: item.wishlist,
      category: item.category,
      name: item.name,
      quantity: item.quantity,
      checked: item.checked,
      important: item.important
    });

  resultChecker(item, res);
}

async function postWishList(wishList, resultChecker) {
  let res = await chai
    .request(server)
    .post("/wishlist")
    .set("Cookie", vars.cookie)
    .send({
      _id: wishList._id,
      name: wishList.name
    });

  resultChecker(wishList, res);
}

async function postCategory(category, resultChecker) {
  let res = await chai
    .request(server)
    .post("/category")
    .set("Cookie", vars.cookie)
    .send({
      _id: category._id,
      wishlist: category.wishlist,
      name: category.name,
      sort: category.sort
    });

  resultChecker(category, res);
}

async function deleteData(url, resultChecker) {
  let res = await chai
    .request(server)
    .delete(url)
    .set("Cookie", vars.cookie);
  resultChecker(null, res);
}
