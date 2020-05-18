"use strict";

const { Router } = require("express");
const placeRouter = new Router();
const routeGuard = require("../middleware/route-guard");

placeRouter.get("/post", (req, res, next) => {
  res.render("post", { title: "My Places" });
});

placeRouter.get("/private", routeGuard, (req, res, next) => {
  res.render("private");
});

module.exports = placeRouter;
