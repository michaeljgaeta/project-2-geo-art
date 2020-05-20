const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    place: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Place"
    }
  },
  {
    timestamps: {
      createdAt: "createdDate",
      updatedAt: "updatedDate"
    }
  }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
