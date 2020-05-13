// imports and setup
const { generateRandomString, getUserByEmail } = require("../helpers");
const { resMessages, users } = require("../constants");

const express = require("express");
const register = express.Router();

const bodyParser = require("body-parser");
register.use(bodyParser.urlencoded({extended: true}));

const cookieSession = require("cookie-session");
register.use(cookieSession({
  name: "session",
  keys: ["userID"]
}));

const bcrypt = require("bcrypt");


// router will manage GET and POST requests directed at /register

// get the 'register' page
register.get("/register", (req, res) => {
  const userID = req.session.userID;

  const templateVars = {
    user: users[userID],
    registerErrorMessage: resMessages.registerErrorMessage
  };

  res.render("urls_register", templateVars);
  resMessages.registerErrorMessage = ""; // resets any error message after displaying it
});

// register a new email and password from the 'register' page
register.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);

  // manage edge cases: empty email or password, email already used
  if (!email || !password) {
    res.statusCode = 400;
    resMessages.registerErrorMessage = `Error ${res.statusCode}: Please enter a valid email and password`;
    res.redirect("back");
  } else if (getUserByEmail(email, users)) {
    res.statusCode = 400;
    resMessages.registerErrorMessage = `Error ${res.statusCode}: Email is already being used`;
    res.redirect("back");
  } else { // otherwise, create the account and assign a session cookie to it
    const userID = generateRandomString();

    users[userID] = {
      id: userID,
      email,
      hashedPassword
    };

    req.session.userID = userID;
    res.redirect("/urls");
  }
});


module.exports = register;