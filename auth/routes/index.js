"use strict";

const express = require("express");
const router = express.Router();
const user = require("../controllers/user");

module.exports = router;

router.get("/*", (req, res, next) => {
  if (/\/user(\/*)$/gi.exec(req.path)) return user.get(req, res, next);
  if (/\/logout(\/*)$/gi.exec(req.path)) return user.logout(req, res, next);
  if (req.user) return next();

  return next({ status: 403 });
});

router.post("/*", (req, res, next) => {
  if (/\/register(\/*)$/gi.exec(req.path)) return user.register(req, res, next);
  if (/\/login(\/*)$/gi.exec(req.path)) return user.login(req, res, next);
  if (req.user) return next();

  return next({ status: 403 });
});

router.delete("/*", (req, res, next) => {
  if (req.user) return next();

  return next({ status: 403 });
});
