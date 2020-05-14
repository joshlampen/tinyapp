// imports and setup
const { getDate, generateRandomString, getUserURLs } = require("../helpers");
const { resMessages, users, urlDatabase } = require("../constants");

const express = require("express");
const urls = express.Router();

const bodyParser = require("body-parser");
urls.use(bodyParser.urlencoded({extended: true}));

const cookieSession = require("cookie-session");
urls.use(cookieSession({
  name: "session",
  keys: ["userID"]
}));


// router will manage GET and POST requests directed at /urls

// get homepage
urls.get("/urls", (req, res) => {
  const userID = req.session.userID;
  const userURLs = getUserURLs(userID, urlDatabase);

  if (userID) {
    const templateVars = {
      user: users[userID],
      urls: userURLs,
      urlErrorMessage: resMessages.urlErrorMessage
    };
  
    res.render("urls_index", templateVars);
    resMessages.urlErrorMessage = ""; // resets any error message after displaying it
  } else {
    resMessages.loginReminderMessage = "Please login to view your URLs";
    res.redirect("/login");
  }
});

// post new url to homepage
urls.post("/urls", (req, res) => {
  const userID = req.session.userID;
  const shortURL = generateRandomString();
  let longURL = req.body.longURL;
  const dateMade = getDate();

  if (userID) {
    // ensure all long URL entries have the same format of "http://www.[...]"
    if (longURL.split("").slice(0, 4).join("") === "www.") {
      longURL = "http://" + longURL;
    } else if (longURL.split("").slice(0, 7).join("") !== "http://") {
      longURL = "http://www." + longURL;
    }
  
    urlDatabase[shortURL] = {
      longURL,
      userID,
      hits: 0,
      uniqueVisitors: 0,
      dateMade
    };
  
    res.redirect(`/urls/${shortURL}`);
  } else {
    resMessages.loginReminderMessage = "Please login to create a new URL";
    res.redirect("/login");
  }
});


module.exports = urls;