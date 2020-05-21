const express = require("express");
const routeGuard = require("./../middleware/route-guard");

const Comment = require("./../models/comment");
const Place = require("./../models/place");
const User = require("./../models/user");

const commentsRouter = new express.Router();

//GET ALL COMMENTS VIEW
commentsRouter.get("/:id", routeGuard, (req, res, next) => {
  const place = req.params.id;

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

// CREATE A COMMENT
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

//

module.exports = commentsRouter;
