"use strict";

const { Router } = require("express");
const profileRouter = new Router();
const routeGuard = require("./../middleware/route-guard");

profileRouter.get("/profile", (req, res, next) => {
  res.render("profile", { title: "Geo Art" });
});

profileRouter.get("/private", routeGuard, (req, res, next) => {
  res.render("private");
});

module.exports = profileRouter;
