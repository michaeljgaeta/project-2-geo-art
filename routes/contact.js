const { Router } = require("express");
const contactRouter = new Router();
const nodemailer = require("nodemailer");

//User gets contact route, display form
contactRouter.get("/", (req, res, next) => {
  res.render("contact");
  console.log(req.session.user);
});

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

//User post to contact route, nodemailer runs
contactRouter.post("/", (req, res, next) => {
  let { email, subject, message } = req.body;
  //transporter runs
  transporter
    .sendMail({
      from: `ArtGeo Team <${process.env.NODEMAILER_EMAIL}>`,
      to: email,
      subject: "Hey, there! We received your message.",
      //html: "<strong>Welcome to the app!</strong><br><a href=www.google.com>Verify Email</a>"
      html: "<p>Thanks for your message, we'll get back to you soon.</p>"
    })
    .then((result) => {
      res.render("message", { email, subject, message });
      console.log("contact form email sent successfuly");
      console.log(result);
    })
    .catch((error) => {
      console.log("There was an error sending the email.");
      console.log(error);
    });
});
module.exports = contactRouter;
