"use strict";

const { Router } = require("express");
const bcryptjs = require("bcryptjs");
const User = require("./../models/user");
const routeGuard = require("./../middleware/route-guard");
const cloudinary = require("cloudinary");
const multer = require("multer");
const multerStorageCloudinary = require("multer-storage-cloudinary");
const router = new Router();

router.get("/sign-up", (req, res, next) => {
  res.render("authentication/sign-up");
});

router.post("/sign-up", (req, res, next) => {
  const { name, email, password } = req.body;
  bcryptjs
    .hash(password, 10)
    .then((hash) => {
      return User.create({
        name,
        email,
        passwordHash: hash
      });
    })
    .then((user) => {
      req.session.user = user._id;
      res.redirect("/");
    })
    .catch((error) => {
      next(error);
    });
});

router.get("/sign-in", (req, res, next) => {
  res.render("authentication/sign-in");
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multerStorageCloudinary({
  cloudinary,
  folder: "geo-art"
});

router.post("/sign-in", (req, res, next) => {
  let user;
  const { email, password } = req.body;
  User.findOne({ email })
    .then((document) => {
      if (!document) {
        return Promise.reject(new Error("There's no user with that email."));
      } else {
        user = document;
        return bcryptjs.compare(password, user.passwordHash);
      }
    })
    .then((result) => {
      if (result) {
        req.session.user = user._id;
        res.redirect("/");
      } else {
        return Promise.reject(new Error("Wrong password."));
      }
    })
    .catch((error) => {
      next(error);
    });
});

router.post("/sign-out", (req, res, next) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
