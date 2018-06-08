let categoriesController = require("../controllers/categories");
let itemsController = require("../controllers/items");
const WishList = require("../models/wishlist");
var ObjectId = require("mongoose").Types.ObjectId;
require("../models/category"); // init child models used in get
require("../models/item");

// GET /wishlist/ - all wishlist without details
// GET /wishlist/5b0d44bde3d7191b2c9c8e8d - wishlist with all data
module.exports.get = async (req, res, next) => {
  try {
    let result = [];
    let conditions = { user: req.user._id };

    if (req.params.wishListId) {
      conditions._id = req.params.wishListId;
      result = (await WishList.find(conditions, "_id name")
        .populate({
          path: "categories",
          select: "_id name sort",
          populate: {
            path: "items",
            select: "_id category wishlist name quantity checked important"
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
    let { user, body: wlData } = req;

    let wishList;

    if (wlData._id) {
      let wls = await WishList.find({ user: user._id, _id: wlData._id }).exec();

      if (wls.length === 0)
        return next({
          status: 400,
          message: `WishList with id: ${wlData._id} does not exist.`
        });

      wishList = wls[0];
      wishList.name = wlData.name;
    } else {
      wishList = new WishList({
        _id: new ObjectId(),
        user: user._id,
        name: wlData.name
      });
    }
    await wishList.save();
    res.json(wishList.toJSON());
  } catch (e) {
    return next(e.status ? e : { status: 400, message: e.message });
  }
};

// DELETE wishlist/5b0d44bde3d7191b2c9c8e8d
module.exports.delete = async (req, res, next) => {
  try {
    let {
      user,
      params: { wishListId }
    } = req;

    await Promise.all([
      this.deleteWishList(user._id, wishListId),
      categoriesController.deleteCategories(user._id, wishListId),
      itemsController.deleteItems(user._id, wishListId)
    ]);

    res.json({ success: true });
  } catch (e) {
    return next(e.status ? e : { status: 400, message: e.message });
  }
};

module.exports.deleteWishList = (userId, wishListId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await WishList.deleteMany({ user: userId, _id: wishListId });
      if (result.n == 1) resolve();
      reject({ status: 400, message: `WishList with id: ${wishListId} does not exist.` });
    } catch (e) {
      reject(e);
    }
  });
};
