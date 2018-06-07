"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },
    wishlist: { type: Schema.Types.ObjectId, ref: "wishlist", required: true },
    name: { type: String, trim: true, required: [true, "should not be empty"] },
    sort: { type: Number, required: true }
  },
  { timestamps: true }
);

CategorySchema.virtual("items", {
  ref: "item",
  localField: "_id",
  foreignField: "category"
});

CategorySchema.set("toJSON", {
  transform: function(doc, ret) {
    delete ret.createdAt;
    delete ret.updatedAt;
    delete ret.__v;
    delete ret.user;
    return ret;
  }
});

module.exports = mongoose.model("category", CategorySchema);
