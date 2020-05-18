"use strict";

const { Router } = require("express");
const profileRouter = new Router();
const routeGuard = require("./../middleware/route-guard");

const User = require("./../models/user");

profileRouter.get("/:userId", routeGuard, (req, res, next) => {
  const userId = req.params.userId;
  console.log(userId);
  res.render("profile/profile");
});

profileRouter.get("/my-places", routeGuard, (req, res, next) => {
  res.render("profile/my-places");
});

profileRouter.get("/:userId/edit", routeGuard, (req, res, next) => {
  const userId = req.params.userId;

  User.findById(userId)
    .then((user) => {
      res.render("profile/edit", { user });
    })
    .catch((error) => {
      next(error);
    });
});

profileRouter.post("/:userId/edit", routeGuard, (req, res, next) => {
  const id = req.user.id;
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  const location = req.body.location;
  User.findByIdAndUpdate(
    {
      _id: req.user.id
    },
    {
      email,
      name,
      password,
      location
    }
  )
    .then((document) => {
      res.redirect(`/profile/${id}`);
    })
    .catch((error) => {
      next(error);
    });
});

profileRouter.get("/private", routeGuard, (req, res, next) => {
  res.render("private");
});

module.exports = profileRouter;
