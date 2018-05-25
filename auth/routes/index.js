const express = require("express");
const passport = require("passport");
const User = require("../models/user");
const router = express.Router();

module.exports = router;

router.post("/register", (req, res, next) => {
  if (!req.body.email) return next({ status: 500, message: "E-mail should not be empty" });

  User.register(
    new User({ username: req.body.username, email: req.body.email }),
    req.body.password,
    err => {
      if (err) return next(err);
      authenticate(req, res, next);
    }
  );
});

function authenticate(req, res, next) {
  passport.authenticate("local", function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next({ status: 400, message: info.message });
    }

    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      req.session.save(err => {
        if (err) {
          return next(err);
        }
        sendUserInfo(req, res);
      });
    });
  })(req, res, next);
}

function sendUserInfo(req, res) {
  res.status(200).json(
    req.user
      ? {
          username: req.user.username,
          email: req.user.email
        }
      : {}
  );
}

router.post("/login", (req, res, next) => {
  authenticate(req, res, next);
});

router.get("/logout", (req, res, next) => {
  req.logout();
  req.session.save(err => {
    if (err) {
      return next(err);
    }
    res.json({ result: "success" });
  });
});

router.get("/user", (req, res) => {
  sendUserInfo(req, res);
});
