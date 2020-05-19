"use strict";

const { Router } = require("express");
const routeGuard = require("./../middleware/route-guard");

//require place model
const Place = require("./../models/place");

//require cloudinary packages
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
  folder: "april-2020"
});

const uploader = multer({ storage });
// const uploader = multer({ dest: 'tmp' }); // Storing locally in tmp folder

const router = new Router();

//get place from database, display by most recent
router.get("/", (req, res, next) => {
  Place.find()
    .sort({ createdAt: -1 })
    // .limit(2)
    // .skip(1)
    .populate("creator")
    .then((places) => {
      console.log(places);
      res.render("index", { places });
    })
    .catch((error) => {
      next(error);
    });
});

router.get("/private", routeGuard, (req, res, next) => {
  res.render("private");
});

module.exports = router;
