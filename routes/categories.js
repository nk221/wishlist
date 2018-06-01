let express = require("express");
let router = express.Router();
let categoriesController = require("../controllers/categories");

router.post("/*", categoriesController.post);
router.delete("/*", categoriesController.delete);

module.exports = router;
