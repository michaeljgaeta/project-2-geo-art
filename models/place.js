"use strict";

const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 1,
      maxlength: 20,
      required: true
    },
    description: {
      type: String,
      minlength: 1,
      maxlength: 200,
      required: true
    },
    like_count: { type: Number, default: 0 },

    user_liked: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    location: {
      type: {
        type: String,
        default: "Point",
        required: true
      },
      coordinates: [
        {
          type: mongoose.Schema.Types.Decimal128,
          min: -180,
          max: 180
        }
      ]
    },
    pictureUrl: {
      type: String
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    }
  },
  {
    timestamps: {
      /*currentTime: () => Math.floor(Date.now() / 1000)*/
      createdAt: "createdDate",
      updatedAt: "updatedDate"
    },
  },
  {
  time: { 
    type: Date, 
    default: Date.now
  }
});

module.exports = mongoose.model("Place", placeSchema);
