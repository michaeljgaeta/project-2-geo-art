const { Router } = require("express");
const contactRouter = new Router();
const nodemailer = require("nodemailer");

//User gets contact route, display form
contactRouter.get("/", (req, res, next) => {
  res.render("contact");
});

//define transporter
let transporter = nodemailer.createTransport({
  service: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD
  }
});

//User post to contact route, nodemailer runs
contactRouter.post("/", (req, res, next) => {
  let { email, subject, message } = req.body;
});
//transporter runs
transporter
  .sendMail({
    from: `ArtGeo Team <${process.env.NODEMAILER_EMAIL}>`,
    to: "michaeljgaeta@gmail.com",
    subject: "Test",
    //send the user to an endpoint specific to verification requests
    html: "<strong>Welcome to the app!</strong><br><a href=www.google.com>Verify Email</a>"
  })
  .then((result) => {
    res.render("message", { email, subject, message });
    console.log("email sent successfuly");
    console.log(result);
  })
  .catch((error) => {
    console.log("There was an error sending the email.");
    console.log(error);
  });

module.exports = contactRouter;
