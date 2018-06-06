let utils = require("../utils");
let categoriesController = require("../controllers/categories");
let itemsController = require("../controllers/items");
const WishList = require("../models/wishlist");
const mongoose = require("mongoose");
var ObjectId = require("mongoose").Types.ObjectId;
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

// POST /wishlist/ body: {_id: null, name: "Simple wishlist"} - insert or update wishlist
module.exports.post = async (req, res, next) => {
  try {
    let { user, body } = req;

    let wishList;

    if (body._id) {
      let wls = await WishList.find({ user: user._id, _id: body._id }).exec();

      if (wls.length === 0)
        return next({
          status: 400,
          message: `WishList with id: ${body._id} does not exist.`
        });

      wishList = wls[0];
      wishList.name = body.name;
    } else {
      wishList = new WishList({
        _id: new ObjectId(),
        user: user._id,
        name: body.name
      });
    }
    await wishList.save();
    res.json(wishList);
  } catch (e) {
    return next(e);
  }
};

// DELETE wishlist/ body: {_id: null}
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
