//* global describe it before after beforeEach afterEach */
//const should = require("should");
/*const chai = require("chai");
const should = chai.should();

const mongoose = require("mongoose");
const config = require("../config");
var User = require("../auth/models/user");
let db;

describe("User", function() {
  before(function(done) {
    db = mongoose.connect(config.mongo.url, done);
  });

  after(function(done) {
    mongoose.connection.close(done);
    //done();
  });

  beforeEach(function(done) {
    var user = new User({
      username: "John",
      password: "pass"
    });

    user.save(function(error) {
      should.not.exist(error);
      done();
    });
  });

  it("Some test", function(done) {
    User.findOne({ username: "Test1" }, function(err, user) {
      should.not.exist(err);
      should.exist(user, "user not exists");
      user.should.have.property("username");
      user.should.have.property("password");
      done();
    });
  });

  it("Some test2", function(done) {
    User.findOne({ username: "John" }, function(err, user) {
      should.not.exist(err);
      should.exist(user, "user not exists");
      user.should.have.property("username");
      user.should.have.property("password");
      user.username.should.eql("John");
      done();
    });
  });

  afterEach(function(done) {
    console.log("afterEach");
    User.findOne({ username: "John" }, function(err, user) {
      should.not.exist(err);
      should.exist(user, "user not exists");
      user.should.have.property("username");
      user.username.should.eql("John");

      User.remove(user, function() {
        done();
      });
    });
  });
});
*/
