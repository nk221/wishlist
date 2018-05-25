const passport = require("passport");
const router = require("./routes");
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;
var mongoose = require("mongoose");
var MongoStore = require("connect-mongo")(session);
const config = require("../config");

//setup passport
var User = require("./models/user");
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//returns all express middleware for auth
module.exports = [
  session({
    secret: config.secret,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 365 * 24 * 60 * 60 // = 14 days. Default
    })
  }),
  passport.initialize(),
  passport.session(),
  router
];
