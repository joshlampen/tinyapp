// imports and setup
const { getUserURLs } = require("../helpers");
const { resMessages, users, urlDatabase } = require("../constants");

const express = require("express");
const showURL = express.Router();

const bodyParser = require("body-parser");
showURL.use(bodyParser.urlencoded({extended: true}));

const cookieSession = require("cookie-session");
showURL.use(cookieSession({
  name: "session",
  keys: ["userID"]
}));


// router will manage GET and POST requests directed at /urls/[shortURL]

// get page for existing short URL from homepage
showURL.get("/urls/:shortURL", (req, res) => {
  const userID = req.session.userID;
  const userURLs = getUserURLs(userID, urlDatabase);
  const shortURL = req.params.shortURL;
  const shortURLInfo = userURLs[shortURL];

  // manage edge cases: short URL does not exist, user is not logged in, short URL does not belong to the user
  if (!urlDatabase[shortURL]) {
    resMessages.urlErrorMessage = "Error: URL does not exist";
    res.redirect("/urls");
  } else if (!req.session.userID) {
    resMessages.loginReminderMessage = "Please login to view your URLs";
    res.redirect("/login");
  } else if (!shortURLInfo) {
    resMessages.urlErrorMessage = "Error: Access to this URL is not permitted from your account";
    res.redirect("/urls");
  } else {
    const templateVars = {
      user: users[userID],
      shortURL,
      shortURLInfo
    };
  
    res.render("urls_show", templateVars);
  }
});

// replace existing short URL on homepage with new long URL
showURL.post("/urls/:shortURL", (req, res) => {
  const userID = req.session.userID;
  const shortURL = req.params.shortURL;
  let newLongURL = req.body.longURL;

  // manage edge cases: user is not logged in, user is logged in but does not have permission to edit the URL
  if (!userID) {
    resMessages.loginReminderMessage = "Please login to update your URLs";
    res.redirect("/login");
  } else if (urlDatabase[shortURL].userID !== userID) {
    resMessages.urlErrorMessage = "Error: You do not have permission to edit that URL";
    res.redirect("/urls");
  } else {
    // ensure all long URL entries have the same format of "http://www.[...]"
    if (newLongURL.split("").slice(0, 4).join("") === "www.") {
      newLongURL = "http://" + newLongURL;
    } else if (newLongURL.split("").slice(0, 7).join("") !== "http://") {
      newLongURL = "http://www." + newLongURL;
    }
    
    // in my view, the long URL should be updated without resetting the other properties of the short URL
    urlDatabase[shortURL].longURL = newLongURL;
  
    res.redirect("/urls");
  }
});


module.exports = showURL;