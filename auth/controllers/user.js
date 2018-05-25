const passport = require("passport");
const User = require("../models/user");

module.exports.register = (req, res, next) => {
  if (!req.body.email) return next({ status: 500, message: "E-mail should not be empty" });

  User.register(
    new User({ username: req.body.username, email: req.body.email }),
    req.body.password,
    err => {
      if (err) return next(err);
      this.login(req, res, next);
    }
  );
};

module.exports.login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next({ status: 400, message: info.message });
    }

    req.logIn(user, err => {
      if (err) {
        return next(err);
      }
      req.session.save(err => {
        if (err) {
          return next(err);
        }
        this.get(req, res);
      });
    });
  })(req, res, next);
};

module.exports.logout = (req, res, next) => {
  req.logout();
  req.session.save(err => {
    if (err) {
      return next(err);
    }
    res.json({ result: "success" });
  });
};

module.exports.get = (req, res) => {
  res.status(200).json(
    req.user
      ? {
          username: req.user.username,
          email: req.user.email
        }
      : {}
  );
};
