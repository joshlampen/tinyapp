// imports and setup
const { resMessages, urlDatabase } = require("../databases");

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

  // manage edge cases: user is not logged in, user is logged in but does not have permission to delete the URL
  if (!userID) {
    resMessages.loginReminderMessage = "Please login to manage your URLs";
    res.redirect("/login");
  } else if (urlDatabase[shortURL].userID !== userID) {
    resMessages.urlErrorMessage = "Error: You do not have permission to delete that URL";
    res.redirect("/urls");
  } else {
    delete urlDatabase[shortURL];
    res.redirect("/urls");
  }
});


module.exports = deleteURL;