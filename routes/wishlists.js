let express = require("express");
let router = express.Router();
let wishListsController = require("../controllers/wishlists");

router.get("/:wishListId?", wishListsController.get);
router.post("/*", wishListsController.post);
router.delete("/:wishListId", wishListsController.delete);

module.exports = router;
