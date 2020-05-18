"use strict";

// Route Guard Middleware
// This piece of middleware is going to check if a user is authenticated
// If not, it sends the request to the app error handler with a message
module.exports = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    //res.alert("Need account");
    res.redirect("/authentication/sign-in");
    /*const error = new Error("Error - You need to login or create an account to view this page.");
    error.status = 401;
    next(error);*/
  }
};
