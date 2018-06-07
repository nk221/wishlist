"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ItemSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },
    wishlist: { type: Schema.Types.ObjectId, ref: "wishlist", required: true },
    category: { type: Schema.Types.ObjectId, ref: "category", required: true },
    name: {
      type: String,
      trim: true,
      required: [true, "name should not be empty!"]
    },
    quantity: {
      type: String,
      trim: true
    },
    checked: {
      type: Boolean,
      required: true
    },
    important: {
      type: Boolean,
      required: true
    }
  },
  { timestamps: true }
);

ItemSchema.set("toJSON", {
  transform: function(doc, ret) {
    delete ret.createdAt;
    delete ret.updatedAt;
    delete ret.__v;
    delete ret.user;
    return ret;
  }
});

module.exports = mongoose.model("item", ItemSchema);
