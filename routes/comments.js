const express = require("express");
const routeGuard = require("./../middleware/route-guard");

const Comment = require("./../models/comment");
const Place = require("./../models/place");
const User = require("./../models/user");

const commentsRouter = new express.Router();

//GET ALL COMMENTS VIEW---------------------------------
commentsRouter.get("/:id", routeGuard, (req, res, next) => {
  const place = req.params.id;
  let post;
  Comment.find({ place })
    .sort({ createdDate: -1 })
    .populate("creator place")
    .then((comment) => {
      if (comment) {
        console.log(comment);
        res.render("places/comments", { comment, place });
      } else {
        console.log("Não tem post");
      }
    })
    .catch((error) => {
      next(error);
    });
});

// CREATE A COMMENT----------------------------
commentsRouter.post("/create/:id", routeGuard, (req, res, next) => {
  const message = req.body.message;
  const placeId = req.params.id;

  Comment.create({
    message,
    creator: req.user._id,
    place: placeId
  })
    .then(() => {
      res.redirect(`/comments/${placeId}`);
    })
    .catch((error) => {
      next(error);
    });
});

//SINGLE COMMENT----------------------

commentsRouter.get("/single/:id", routeGuard, (req, res, next) => {
  const id = req.params.id;
  let isOwner;

  Comment.findById({ _id: id })
    .populate("creator place")

    .then((comment) => {
      if (req.user && comment.creator._id.toString() === req.user._id.toString()) {
        isOwner = true;
      }
      res.render("places/singleComment", { comment, isOwner });
    })

    .catch((error) => {
      next(error);
    });
});

//EDIT COMMENT-------------------------------------------------------

commentsRouter.get("/:placeid/edit/:commentid", routeGuard, (req, res, next) => {
  const id = req.params.commentid;

  Comment.findById({ _id: id })
    .populate("creator place")

    .then((comment) => {
      res.render("places/editComment", { comment });
    })
    .catch((error) => {
      next(error);
    });
});

commentsRouter.post("/:placeid/edit/:commentid", routeGuard, (req, res, next) => {
  const placeid = req.params.placeid;
  const commentid = req.params.commentid;
  const message = req.body.message;
  console.log(message);
  Comment.findOneAndUpdate(
    { _id: commentid },
    {
      message
    }
  )

    .populate("creator place")
    .then((comment) => {
      res.redirect("/");
    })
    .catch((error) => {
      next(error);
    });
});

//DELETE COMMENT------------------------------------------------------
commentsRouter.post("/delete/:id", routeGuard, (req, res, next) => {
  const id = req.params.id;

  Comment.findOneAndDelete({
    _id: id,
    creator: req.user._id
  })
    .then((place) => {
      res.redirect("/");
    })
    .catch((error) => {
      next(error);
    });
});
module.exports = commentsRouter;
