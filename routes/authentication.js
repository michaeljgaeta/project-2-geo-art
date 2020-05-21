"use strict";

const { Router } = require("express");
const bcryptjs = require("bcryptjs");
const User = require("./../models/user");
const routeGuard = require("./../middleware/route-guard");
const router = new Router();
const nodemailer = require("nodemailer");
const randomToken = require("random-token");

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

//define transporter
let transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com", // hostname
  secureConnection: false, // TLS requires secureConnection to be false
  port: 587, // port for secure SMTP
  tls: {
    ciphers: "SSLv3"
  },
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD
  }
});

router.get("/sign-up", (req, res, next) => {
  res.render("authentication/sign-up");
});

router.post("/sign-up", uploader.single("picture"), (req, res, next) => {
  //PASSWORD HASH
  const picture = req.file.url;
  const { name, email, password } = req.body;
  const characters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let token = "";
  for (let i = 0; i < 10; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  bcryptjs
    .hash(password, 10)
    .then((hash) => {
      return User.create({
        name,
        email,
        passwordHash: hash,
        confirmationCode: token,
        picture
      });
    })
    .then((user) => {
      req.session.user = user._id;
      transporter
        .sendMail({
          from: `ArtGeo Team <${process.env.NODEMAILER_EMAIL}>`,
          to: email,
          subject: "Please Verify Your Email",
          html: `<strong>Welcome to the app!</strong><br><a href="http://localhost:3000/authentication/confirm/${user.confirmationCode}">Verify Email</a>`
        })
        .then((result) => {
          res.redirect("/");
          console.log(`http://localhost:3000/authentication/confirm/${user.confirmationCode}`);
          console.log("confirmation email sent successfuly");
          console.log(result);
        })
        .catch((error) => {
          next(error);
        });
    });
});
//CONFIRMATION EMAIL

//USER CONFIRMATION CODE COMPARISON
router.get("/confirm/:confirmationCode", (req, res, next) => {
  let user;
  //const { confirmationCode } = req.params;
  User.findOne({ confirmationCode })
    .then((document) => {
      if (document) {
        res.render("/authentication/confirm");
      }
    })
    .catch((error) => {
      next(error);
    });
});

router.get("/sign-in", (req, res, next) => {
  res.render("authentication/sign-in");
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
