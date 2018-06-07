const Item = require("../models/item");
var ObjectId = require("mongoose").Types.ObjectId;

// POST /item/ body: {item_data} - insert or update item
module.exports.post = async (req, res, next) => {
  try {
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
