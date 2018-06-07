let itemsController = require("../controllers/items");
const Category = require("../models/category");
const WishList = require("../models/wishlist");
var ObjectId = require("mongoose").Types.ObjectId;

// POST /category/ body: {wishlist:5b0d44bde3d7191b2c9c8e8d, _id: null, name: "To Buy", sort: 0} - insert or update category
module.exports.post = async (req, res, next) => {
  try {
    let { user, body: catData } = req;

    let wls = await WishList.findOne({ _id: catData.wishlist });
    if (!wls) {
      return next({
        status: 400,
        message: `Wishlist with id: ${catData.wishlist} does not exist.`
      });
    }

    let category;

    if (catData._id) {
      let cats = await Category.find({ user: user._id, _id: catData._id }).exec();

      if (cats.length === 0)
        return next({
          status: 400,
          message: `Category with id: ${catData._id} does not exist.`
        });

      category = cats[0];
      category.name = catData.name;
      category.wishlist = catData.wishlist;
      category.sort = catData.sort;
    } else {
      category = new Category({
        _id: new ObjectId(),
        wishlist: catData.wishlist,
        user: user._id,
        name: catData.name,
        sort: catData.sort
      });
    }
    await category.save();
    res.json(category.toJSON());
  } catch (e) {
    return next(e.status ? e : { status: 400, message: e.message });
  }
};

// DELETE wishlist/5b0d44bde3d7191b2c9c8e8d
module.exports.delete = async (req, res, next) => {
  try {
    let {
      user,
      params: { categoryId }
    } = req;
    await Promise.all([
      this.deleteCategories(user._id, null, categoryId),
      itemsController.deleteItems(user._id, null, categoryId)
    ]);

    res.json({ success: true });
  } catch (e) {
    return next(e.status ? e : { status: 400, message: e.message });
  }
};

module.exports.deleteCategories = (userId, wishListId, categoryId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let conditions = { user: userId };
      if (wishListId) conditions.wishlist = new ObjectId(wishListId);
      if (categoryId) conditions._id = categoryId;
      let result = await Category.deleteMany(conditions);
      if (categoryId) {
        if (result.n == 1) resolve();
        reject({ status: 400, message: `Category with id: ${categoryId} does not exist.` });
      }
      if (result.ok == 1) resolve();
      reject({ status: 400, message: "Failed to delete Categories" });
    } catch (e) {
      reject(e);
    }
  });
};
