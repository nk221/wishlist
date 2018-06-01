"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },
    wishlist: { type: Schema.Types.ObjectId, ref: "wishlist", required: true },
    name: { type: String, trim: true, required: true }
  },
  { timestamps: true }
);

CategorySchema.virtual("items", {
  ref: "item",
  localField: "_id",
  foreignField: "category"
});

CategorySchema.pre("remove", function(next) {
  this.model("item").remove({ wishlist: mongoose.Types.ObjectId(this._id) }, next);
});

module.exports = mongoose.model("category", CategorySchema);
