let utils = require("../utils");
let categoriesController = require("../controllers/categories");
let itemsController = require("../controllers/items");
const WishList = require("../models/wishlist");
require("../models/category"); // init child models used in get
require("../models/item");
/**
 * GET /wishlist/ - all wishlist without details
 * GET /wishlist/5b0d44bde3d7191b2c9c8e8d - wishlist with all data
 */
module.exports.get = async (req, res, next) => {
  try {
    let result = [];
    let conditions = { user: req.user._id };

    if (req.params.wishListId) {
      conditions._id = req.params.wishListId;
      result = (await WishList.find(conditions, "_id name")
        .populate({
          path: "categories",
          select: "_id name",
          populate: {
            path: "items",
            select: "_id name quantity checked important"
          }
        })
        .exec()).map(wl => wl.toObject({ virtuals: true }));
    } else {
      result = await WishList.find(conditions, "_id name").exec();
    }

    res.json(result);
  } catch (e) {
    return next(e);
  }
};

/**
 * POST /wishlist/ body: {_id: null, name: "Simple wishlist"} - insert or update wishlist
 */
module.exports.post = async (req, res, next) => {
  try {
    let { userId, body } = req;
    //TODO: insert or update wishlist
    //res.json({ _id: wishlistId });
  } catch (e) {
    return next(e);
  }
};

/**
 * DELETE wishlist/ body: {_id: null}
 */
module.exports.delete = async (req, res, next) => {
  try {
    let {
      userId,
      body: { _id }
    } = req;

    _id = utils.prepareId(_id, "WishListId");
    await itemsController.delete(userId, _id, null, null);
    await categoriesController.delete(userId, _id, null);
    //TODO: delete wishlist
    res.json({ success: true });
  } catch (e) {
    return next(e);
  }
};
