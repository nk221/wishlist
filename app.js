const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const app = express();
const mongoose = require("mongoose");
const config = require("./config");
const wishListRouter = require("./routes/wishlists");
const categoriesRouter = require("./routes/categories");
const itemsRouter = require("./routes/items");
mongoose.connect(config.mongo.url);
const auth = require("./auth"); //uses mongoose.connection, connect it before

app.disable("etag"); //helps to prevent caching (304)
if (process.env.NODE_ENV !== "test") app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));
app.use(auth);

app.use("/wishlist", wishListRouter);
app.use("/category", categoriesRouter);
app.use("/item", itemsRouter);

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
