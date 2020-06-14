// imports and setup
const express = require("express");
const index = express.Router();

const cookieSession = require("cookie-session");
index.use(cookieSession({
  name: "session",
  keys: ["userID"]
}));


// router will manage GET requests directed at '/'

// get homepage
index.get("/", (req, res) => {
  const userID = req.session.userID;

  // direct the user to /urls or /login based on if they're logged on
  if (userID) {
    res.redirect("/urls");
  } else {
    res.redirect("/register");
  }
});


module.exports = index;