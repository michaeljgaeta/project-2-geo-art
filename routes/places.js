"use strict";

const { Router } = require("express");
const placesRouter = new Router();
const Place = require("./../models/place");
const routeGuard = require("../middleware/route-guard");

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

//ROUTES CRUD ------------------------------------------

//PLACES LIST OF A USER
placesRouter.get("/my-list", routeGuard, (req, res, next) => {
  const creator = req.user.id;
  Place.find({ creator })
    .then((places) => {
      console.log(places);
      res.render("places/my-list", { places });
    })
    .catch((error) => {
      next(error);
    });
});

//CREATE NEW PLACE
placesRouter.get("/create", routeGuard, (req, res, next) => {
  res.render("places/create");
});

placesRouter.post("/create", routeGuard, uploader.single("picture"), (req, res, next) => {
  const name = req.body.name;
  const description = req.body.description;
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;
  const pictureUrl = req.file.url;
  console.log(req.user.id);

  return Place.create({
    name,
    description,
    location: {
      coordinates: [longitude, latitude]
    },
    pictureUrl,
    creator: req.user.id
  })
    .then((place) => {
      res.redirect("my-list");
    })
    .catch((error) => {
      next(error);
    });
});

//SINGLE PLACE VIEW
placesRouter.get("/:id", (req, res, next) => {
  const id = req.params.id;
  Place.findById(id)
    .then((place) => {
      res.render("places/single", { place });
    })
    .catch((error) => {
      next(error);
    });
});

//UPDATE PLACE
placesRouter.get("/update/:id", (req, res, next) => {
  const id = req.params.id;

  Place.findById(id)
    .then((place) => {
      res.render("places/update", { place });
    })
    .catch((error) => {
      next(error);
    });
});

placesRouter.post("/update/:id", (req, res, next) => {
  const id = req.params.id;
  const name = req.body.name;
  const description = req.body.description;
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;

  const query = {
    name,
    description,
    location: {
      coordinates: [longitude, latitude]
    }
  };

  Place.findOneAndUpdate({ _id: id }, query)
    .then((place) => {
      res.redirect("/places/my-list");
    })
    .catch((error) => {
      next(error);
    });
});

//DELETE PLACE
placesRouter.post("/delete/:id", (req, res, next) => {
  const id = req.params.id;

  Place.findByIdAndDelete(id)
    .then((place) => {
      res.redirect("/places/my-list");
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = placesRouter;
