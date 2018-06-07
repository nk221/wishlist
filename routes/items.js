let express = require("express");
let router = express.Router();
let itemsController = require("../controllers/items");

router.post("/*", itemsController.post);
router.delete("/:itemId", itemsController.delete);

module.exports = router;
