"use strict";

const { Router } = require("express");
const profileRouter = new Router();
const routeGuard = require("./../middleware/route-guard");

profileRouter.get("/profile/:userId", (req, res, next) => {
  const userId = req.body.userId
  console.log(userId);
  res.render("profile", { title: "Geo Art" });
});

profileRouter.get("/private", routeGuard, (req, res, next) => {
  res.render("private");
});

module.exports = profileRouter;

//mike code