const Item = require("../models/item");
var ObjectId = require("mongoose").Types.ObjectId;
const Category = require("../models/category");
const WishList = require("../models/wishlist");

// POST /item/ body: {item_data} - insert or update item
module.exports.post = async (req, res, next) => {
  try {
    let { user, body: itemData } = req;

    let wls = await WishList.findOne({ _id: itemData.wishlist });
    if (!wls) {
      return next({
        status: 400,
        message: `Wishlist with id: ${itemData.wishlist} does not exist.`
      });
    }

    let cat = await Category.findOne({ _id: itemData.category });
    if (!cat) {
      return next({
        status: 400,
        message: `Category with id: ${itemData.category} does not exist.`
      });
    }

    let item;

    if (itemData._id) {
      let items = await Item.find({ user: user._id, _id: itemData._id }).exec();

      if (items.length === 0)
        return next({
          status: 400,
          message: `Item with id: ${itemData._id} does not exist.`
        });

      item = items[0];
      item.wishlist = itemData.wishlist;
      item.category = itemData.category;
      item.name = itemData.name;
      item.quantity = itemData.quantity;
      item.checked = itemData.checked;
      item.important = itemData.important;
    } else {
      item = new Item({
        _id: new ObjectId(),
        wishlist: itemData.wishlist,
        category: itemData.category,
        user: user._id,
        name: itemData.name,
        quantity: itemData.quantity,
        checked: itemData.checked,
        important: itemData.important
      });
    }
    await item.save();
    res.json(item.toJSON());
  } catch (e) {
    return next(e.status ? e : { status: 400, message: e.message });
  }
};

// DELETE item/5b0d44bde3d7191b2c9c8e8d
module.exports.delete = async (req, res, next) => {
  try {
    let {
      user,
      params: { itemId }
    } = req;
    await this.deleteItems(user._id, null, null, itemId);
    res.json({ success: true });
  } catch (e) {
    return next(e.status ? e : { status: 400, message: e.message });
  }
};

module.exports.deleteItems = (userId, wishListId, categoryId, itemId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let conditions = { user: userId };
      if (wishListId) conditions.wishlist = new ObjectId(wishListId);
      if (categoryId) conditions.category = new ObjectId(categoryId);
      if (itemId) conditions._id = itemId;
      let result = await Item.deleteMany(conditions);
      if (itemId) {
        if (result.n == 1) resolve();
        reject({ status: 400, message: `Item with id: ${itemId} does not exist.` });
      }
      if (result.ok == 1) resolve();
      reject({ status: 400, message: "Failed to delete Items" });
    } catch (e) {
      reject(e);
    }
  });
};
