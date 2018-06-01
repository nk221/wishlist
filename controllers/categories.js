let utils = require("../utils");
let itemsController = require("../controllers/items");

/**
 * POST /category/ body: {_id: null, name: "To Buy", sort: 0} - insert or update category
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
 * DELETE wishlist/ body: {_id: null}
 */
module.exports.delete = async (req, res, next) => {
  try {
    let {
      userId,
      body: { _id }
    } = req;

    _id = utils.prepareId(_id, "CategoryId");

    await this.deleteCategory(userId, null, _id);
    res.json({ success: true });
  } catch (e) {
    return next(e);
  }
};

module.exports.deleteCategory = async (userId, wishListId, categoryId) => {
  try {
    await itemsController.deleteItem(userId, wishListId, categoryId, null);
    //TODO: delete category
  } catch (e) {
    throw e; //TODO: check it!
  }
};
