var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var app = express();
var auth = require("./auth");
var mongoose = require("mongoose");
const config = require("./config");

mongoose.connect(config.mongo.url);

app.disable("etag"); //helps to prevent caching (304)
if (process.env.NODE_ENV !== "test") app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(auth);

app.use(express.static(path.join(__dirname, "public")));

/////////////////////////////////////
//              ERRORS             //
/////////////////////////////////////
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404, "Not found."));
});

// error handler
app.use(function(err, req, res, next) {
  // !!! do not remove "next" parameter !!!

  let is_production = process.env.NODE_ENV === "production";
  //is_production = true;

  if (!err.status) err.status = 500;
  let e = {
    error: {
      status: err.status,
      message: err.status === 500 && is_production ? "Internal server error." : err.message
    }
  };

  if (err.stack && !is_production) e.error.stack = err.stack;

  res.status(err.status);
  res.json(e);
});

module.exports = app;
