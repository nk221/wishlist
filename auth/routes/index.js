const express = require("express");
const router = express.Router();
const user = require("../controllers/user");

module.exports = router;

router.post("/register", user.register);
router.post("/login", user.login);
router.get("/logout", user.logout);
router.get("/user", user.get);
