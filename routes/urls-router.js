// imports and setup
const { generateRandomString, getUserURLs } = require("../helpers");
const { users, urlDatabase } = require("../constants");

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

  const templateVars = {
    user: users[userID],
    urls: userURLs
  };

  res.render("urls_index", templateVars);
});

// post new url to homepage
urls.post("/urls", (req, res) => {
  const userID = req.session.userID;
  const key = generateRandomString();
  let longURL = req.body.longURL;

  // ensure all long URL entries have the same format of "http://www.[...]"
  if (longURL.split("").slice(0, 4).join("") === "www.") {
    longURL = "http://" + longURL;
  } else if (longURL.split("").slice(0, 7).join("") !== "http://") {
    longURL = "http://www." + longURL;
  }

  urlDatabase[key] = {
    longURL,
    userID
  };

  res.redirect(`/urls/${key}`);
});


module.exports = urls;