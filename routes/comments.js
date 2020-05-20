const express = require("express");
const routeGuard = require("./../middleware/route-guard");

const Comment = require("./../models/comment");
const Place = require("./../models/place");
const User = require("./../models/user");

const commentsRouter = new express.Router();

//CREATE A COMMENT
commentsRouter.post("place/:id", routeGuard, (req, res, next) => {});

module.exports = commentsRouter;
