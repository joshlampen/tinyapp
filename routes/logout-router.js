// imports and setup
const express = require("express");
const logout = express.Router();

const cookieSession = require("cookie-session");
logout.use(cookieSession({
  name: "session",
  keys: ["userID"]
}));


// router will manage POST requests directed at /logout

// 'logout' and clear the userID session cookie
logout.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});


module.exports = logout;