"use strict";

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: true,
      minlength: 8
    },
    status: { 
      Type: String,
      enum: ['Pending Confirmation', 'Active']
    },
    confirmationCode: {
      Type: String
    },
    location: {
      type: String
    },
    bio: {
      type: String
    },
    picture: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);
