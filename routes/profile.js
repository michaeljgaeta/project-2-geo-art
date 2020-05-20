"use strict";
const { Router } = require("express");
const profileRouter = new Router();
const routeGuard = require("./../middleware/route-guard");

const User = require("./../models/user");

//CLOUDINARY CONFIG-------------------------------
const multer = require("multer");
const cloudinary = require("cloudinary");
const multerStorageCloudinary = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multerStorageCloudinary({
  cloudinary,
  folder: "GEOARTPROJECT"
});

const uploader = multer({ storage });
//--------------------------------------------------

profileRouter.get("/:userId", routeGuard, (req, res, next) => {
  const userId = req.params.userId;
  //console.log(userId);
  res.render("profile/profile");
});

profileRouter.get("/my-places", routeGuard, (req, res, next) => {
  res.render("profile/my-places");
});

//UPDATE PROFILE

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

profileRouter.post("/edit/:userid", routeGuard, uploader.single("picture"), (req, res, next) => {
  const id = req.params.userid;

  const name = req.body.name;
  const email = req.body.email;
  const location = req.body.location;
  const bio = req.body.bio;

  let picture = "";

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
  }

  User.findByIdAndUpdate({ _id: id }, updatedDocument)

    .then((document) => {
      res.redirect("/");
    })
    .catch((error) => {
      next(error);
    });
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
