"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WishListSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },
    name: { type: String, trim: true, required: [true, "name should not be empty!"] }
  },
  { timestamps: true }
);

WishListSchema.virtual("categories", {
  ref: "category",
  localField: "_id",
  foreignField: "wishlist"
});

WishListSchema.pre("remove", async function(next) {
  this.model("category").remove({ wishlist: mongoose.Types.ObjectId(this._id) }, next);
  this.model("item").remove({ wishlist: mongoose.Types.ObjectId(this._id) }, next);
});

module.exports = mongoose.model("WishList", WishListSchema);
