const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
const timestamps = require("mongoose-timestamp");

var User = new Schema({
  username: String,
  password: String,
  email: String
});

User.plugin(timestamps, {
  createdAt: { index: true },
  updatedAt: { index: true }
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model("user", User);
