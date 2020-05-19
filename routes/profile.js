"use strict";
const { Router } = require("express");
const profileRouter = new Router();
const routeGuard = require("./../middleware/route-guard");

const User = require("./../models/user");

profileRouter.get("/:userId", routeGuard, (req, res, next) => {
  const userId = req.params.userId;
  //console.log(userId);
  res.render("profile/profile");
});

profileRouter.get("/my-places", routeGuard, (req, res, next) => {
  res.render("profile/my-places");
});

profileRouter.get("/edit/:userid", routeGuard, (req, res, next) => {
  const id = req.params.userid;

  User.findById(id)
    .then((user) => {
      res.render("profile/edit", { user });
    })
    .catch((error) => {
      next(error);
    });
});

//PROBLEM GETTING REQ.BODY INFORMATION, APPEARS UNDEFINED
profileRouter.post("/edit/:userid", routeGuard, (req, res, next) => {
  const id = req.params.userid;

  const name = req.body.name;
  const email = req.body.email;
  const location = req.body.location;
  const bio = req.body.bio;

  console.log(id, email, name, location, bio);

  res.redirect("/");

  /*let picture = "";

  let updatedDocument = {};

  if (req.file) {
    pictureUrl = req.file.url;
    updatedDocument = {
      name,
      email,
      location,
      bio,
      picture
    };
  } else {
    updatedDocument = {
      name,
      email,
      location,
      bio
    };
  }*/

  //User.findByIdAndUpdate({ _id: id }, updatedDocument)

  /*
    .then((document) => {
      res.redirect("/");
    })
    .catch((error) => {
      next(error);
    });*/
});

//DELETE Profile
profileRouter.post("/delete", (req, res, next) => {
  const id = req.user._id;
  User.findByIdAndDelete(id)
    .then((user) => {
      res.redirect("/");
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = profileRouter;
