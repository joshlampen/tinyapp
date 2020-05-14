// imports and setup
const { getUserByEmail } = require("../helpers");
const { resMessages, users } = require("../constants");

const express = require("express");
const login = express.Router();

const bodyParser = require("body-parser");
login.use(bodyParser.urlencoded({extended: true}));

const cookieSession = require("cookie-session");
login.use(cookieSession({
  name: "session",
  keys: ["userID"]
}));

const bcrypt = require("bcrypt");


// router will manage GET and POST requests directed at /login

// get the 'login' page
login.get("/login", (req, res) => {
  const userID = req.session.userID;

  if (userID) {
    res.redirect("/urls");
  } else {
    const templateVars = {
      user: users[userID],
      loginErrorMessage: resMessages.loginErrorMessage,
      loginReminderMessage: resMessages.loginReminderMessage
    };
  
    res.render("urls_login", templateVars);
    resMessages.loginErrorMessage = ""; // resets any error message(s) after displaying it
    resMessages.loginReminderMessage = "";
  }
});

// 'login' with existing email and password
login.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = getUserByEmail(email, users);

  // manage edge cases: empty email or password, user does not exist, password does not match email
  if (!email || !password) {
    res.statusCode = 400;
    resMessages.loginErrorMessage = `Error ${res.statusCode}: Please enter a valid email and password`;
    res.redirect("back");
  } else if (!user) {
    res.statusCode = 403;
    resMessages.loginErrorMessage = `Error ${res.statusCode}: Email cannot be found`;
    res.redirect("back");
  } else if (!bcrypt.compareSync(password, user.hashedPassword)) {
    res.statusCode = 403;
    resMessages.loginErrorMessage = `Error ${res.statusCode}: Password does not match email`;
    res.redirect("back");
  } else { // otherwise, login and set the cookie based on the userID
    req.session.userID = user.id;
    res.redirect("/urls");
  }
});


module.exports = login;