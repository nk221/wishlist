"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WishListSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },
    name: { type: String, trim: true, required: [true, "should not be empty"] }
  },
  { timestamps: true }
);

WishListSchema.virtual("categories", {
  ref: "category",
  localField: "_id",
  foreignField: "wishlist"
});

WishListSchema.set("toJSON", {
  transform: function(doc, ret) {
    delete ret.createdAt;
    delete ret.updatedAt;
    delete ret.__v;
    delete ret.user;
    return ret;
  }
});

module.exports = mongoose.model("WishList", WishListSchema);
