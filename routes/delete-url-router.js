// imports and setup
const { urlDatabase } = require("../constants");

const express = require("express");
const deleteURL = express.Router();

const cookieSession = require("cookie-session");
deleteURL.use(cookieSession({
  name: "session",
  keys: ["userID"]
}));


// router will manage POST requests directed at /urls/[shortURL]/delete

// delete existing short URL from homepage
deleteURL.post("/urls/:shortURL/delete", (req, res) => {
  const userID = req.session.userID;
  const shortURL = req.params.shortURL;

  if (urlDatabase[shortURL].userID === userID) { // ensure that only the owner of the url can delete it
    delete urlDatabase[shortURL];
    res.redirect("/urls");
  }
});


module.exports = deleteURL;