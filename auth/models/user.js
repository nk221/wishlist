const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

var User = new Schema(
  {
    username: String,
    password: String,
    email: String
  },
  { timestamps: true }
);

User.plugin(passportLocalMongoose);

module.exports = mongoose.model("user", User);
