let utils = require("../utils");
let itemsController = require("../controllers/items");

/**
 * POST /item/ body: {item_data} - insert or update item
 */
module.exports.post = async (req, res, next) => {
  try {
    let { userId, body } = req;
    //TODO: insert or update category
    //res.json({ _id: categoryId });
  } catch (e) {
    return next(e);
  }
};

/**
 * DELETE item/ body: {_id: null}
 */
module.exports.delete = async (req, res, next) => {
  try {
    let {
      userId,
      body: { _id }
    } = req;

    _id = utils.prepareId(_id, "ItemId");

    await this.deleteItem(userId, null, null, _id);
    res.json({ success: true });
  } catch (e) {
    return next(e);
  }
};

module.exports.deleteItem = async (userId, wishListId, categoryId, itemId) => {
  try {
    //TODO: delete items
  } catch (e) {
    throw e; //TODO: check it!
  }
};
