"use strict";

const { Router } = require("express");
const placeRouter = new Router();
const routeGuard = require("./../middleware/route-guard");

placeRouter.get("/my-places", (req, res, next) => {
  res.render("profile/my-places", { title: "Geo Art" });
});

placeRouter.get("/private", routeGuard, (req, res, next) => {
  res.render("private");
});

module.exports = placeRouter;
