"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const timestamps = require("mongoose-timestamp");

const WishListSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "user", required: true },
  categories: [
    {
      name: {
        type: String,
        trim: true,
        required: true
      },
      sort: {
        type: Number,
        required: true,
        default: 0
      },
      items: [
        {
          name: {
            type: String,
            trim: true,
            required: true
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
        }
      ]
    }
  ]
});

WishListSchema.plugin(timestamps, {
  createdAt: { index: true },
  updatedAt: { index: true }
});

module.exports = mongoose.model("WishList", WishListSchema);
