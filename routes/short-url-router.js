// imports and setup
const { getUserURLs } = require("../helpers");
const { resMessages, users, urlDatabase } = require("../constants");

const express = require("express");
const shortURL = express.Router();

const bodyParser = require("body-parser");
shortURL.use(bodyParser.urlencoded({extended: true}));

const cookieSession = require("cookie-session");
shortURL.use(cookieSession({
  name: "session",
  keys: ["userID"]
}));


// router will manage GET and POST requests directed at /urls/[shortURL]

// get page for existing short URL from homepage
shortURL.get("/urls/:shortURL", (req, res) => {
  const userID = req.session.userID;
  const userURLs = getUserURLs(userID, urlDatabase);
  const shortURL = req.params.shortURL;
  const longURL = userURLs[shortURL];

  // manage edge cases: user is not logged in, short URL does not belong to the user
  if (!req.session.userID) {
    resMessages.loginReminderMessage = "Please login to view your URLs";
    res.redirect("/login");
  } else if (!longURL) {
    resMessages.urlErrorMessage = "Access to this URL is not permitted from your account\nYou can create your own URL here";
    res.redirect("/urls/new");
  } else {
    const templateVars = {
      user: users[userID],
      shortURL,
      longURL
    };
  
    res.render("urls_show", templateVars);
  }
});

// replace existing short URL on homepage with new long URL
shortURL.post("/urls/:shortURL", (req, res) => {
  const userID = req.session.userID;
  const shortURL = req.params.shortURL;
  let newLongURL = req.body.longURL;

  // ensure all long URL entries have the same format of "http://www.[...]"
  if (newLongURL.split("").slice(0, 4).join("") === "www.") {
    newLongURL = "http://" + newLongURL;
  } else if (newLongURL.split("").slice(0, 7).join("") !== "http://") {
    newLongURL = "http://www." + newLongURL;
  }
  
  // ensure the short URL can only be edited by the user to whom it belongs to
  if (urlDatabase[shortURL].userID === userID) {
    urlDatabase[shortURL] = {
      longURL: newLongURL,
      userID
    };
  
    res.redirect("/urls");
  }
});


module.exports = shortURL;