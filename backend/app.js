//Requires
const express = require("express");
const path = require("path");
const HttpError = require("./models/http-error");
require("dotenv").config();
//Security requires
const helmet = require("helmet");
const bouncer = require("express-bouncer")(10000, 600000, 5);
const toobusy = require("toobusy-js");
//Routes requires
const userRoutes = require("./routes/user");
//Express app creation
const app = express();
// Helmet firewall
app.use(helmet());
//Request parsing
app.use(express.json());
//Cors headers
app.use((req, res, next) => {
  res.header("Cross-Origin-Resource-Policy", "cross-origin");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization, Access-Control-Allow-Headers");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});
//Bouncer 
bouncer.blocked = function (req, res, next, remaining) {
  res.status(429).send("Too many requests have been made, " + "please wait " + remaining / 1000 + " seconds");
};
//TooBusy 
app.use(function (req, res, next) {
  if (toobusy()) {
      res.status(503).send("Server Too Busy");
  } else {
      next();
  }
});
//Routes
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/user", userRoutes);
//404 errors
app.use((req,res,next) => {
  const error = new HttpError("Route non trouvée", 404);
  throw error;
});
//Server errors
app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "problème serveur, réessayer ultérieurement"});
});

module.exports = app;