const { generateRandomString, getUserByEmail, getUserURLs } = require("./helpers");
const { resMessages, users, urlDatabase } = require("./constants");

// imports and setup
const express = require("express");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

const bcrypt = require("bcrypt");

const cookieSession = require("cookie-session");
app.use(cookieSession({
  name: "session",
  keys: ["userID"]
}));


// get homepage
app.get("/urls", (req, res) => {
  const userID = req.session.userID;
  const userURLs = getUserURLs(userID, urlDatabase);

  const templateVars = {
    user: users[userID],
    urls: userURLs
  };

  res.render("urls_index", templateVars);
});

// post new url to homepage
app.post("/urls", (req, res) => {
  const userID = req.session.userID;
  const key = generateRandomString();
  let longURL = req.body.longURL;

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

// get page for creating new url
app.get("/urls/new", (req, res) => {
  if (req.session.userID) {
    const userID = req.session.userID;
    const templateVars = {
      user: users[userID],
      urlErrorMessage: resMessages.urlErrorMessage
    };
    res.render("urls_new", templateVars);
    resMessages.urlErrorMessage = "";
  } else {
    resMessages.loginReminderMessage = "Please login to create a new URL";
    res.redirect("/login");
  }
});

// delete existing short URL from homepage
app.post("/urls/:shortURL/delete", (req, res) => {
  const userID = req.session.userID;
  const shortURL = req.params.shortURL;

  if (urlDatabase[shortURL].userID === userID) {
    delete urlDatabase[shortURL];
    res.redirect("/urls");
  }
});

// get page for existing short URL from homepage
app.get("/urls/:shortURL", (req, res) => {
  const userID = req.session.userID;
  const userURLs = getUserURLs(userID, urlDatabase);
  const shortURL = req.params.shortURL;
  const longURL = userURLs[shortURL];

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
app.post("/urls/:shortURL", (req, res) => {
  const userID = req.session.userID;
  const shortURL = req.params.shortURL;
  let newLongURL = req.body.longURL;

  if (newLongURL.split("").slice(0, 4).join("") === "www.") {
    newLongURL = "http://" + newLongURL;
  } else if (newLongURL.split("").slice(0, 7).join("") !== "http://") {
    newLongURL = "http://www." + newLongURL;
  }

  if (urlDatabase[shortURL].userID === userID) {
    urlDatabase[shortURL] = {
      longURL: newLongURL,
      userID
    };
  
    res.redirect("/urls");
  }
});

// get long URL page from short URL
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;

  res.redirect(longURL);
});


// LOGIN AND LOGOUT
// 'logout' and clear the appropriate userID cookie
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

// get the 'register' page
app.get("/register", (req, res) => {
  const userID = req.session.userID;
  const templateVars = {
    user: users[userID],
    registerErrorMessage: resMessages.registerErrorMessage
  };
  res.render("urls_register", templateVars);
  resMessages.registerErrorMessage = "";
});

// register a new email and password from the 'register' page
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);

  if (!email || !password) {
    res.statusCode = 400;
    resMessages.registerErrorMessage = `Error ${res.statusCode}: Please enter a valid email and password`;
    res.redirect("back");
  } else if (getUserByEmail(email, users)) {
    res.statusCode = 400;
    resMessages.registerErrorMessage = `Error ${res.statusCode}: Email is already being used`;
    res.redirect("back");
  } else {
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

// get the 'login' page
app.get("/login", (req, res) => {
  const userID = req.session.userID;
  const templateVars = {
    user: users[userID],
    loginErrorMessage: resMessages.loginErrorMessage,
    loginReminderMessage: resMessages.loginReminderMessage
  };
  res.render("urls_login", templateVars);
  resMessages.loginErrorMessage = "";
  resMessages.loginReminderMessage = "";
});

// 'login' with existing email and password
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = getUserByEmail(email, users);

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
  } else {
    req.session.userID = user.id;
    res.redirect("/urls");
  }
});