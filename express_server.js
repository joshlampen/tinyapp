// imports and setup
const express = require("express");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


// constants --> move to other file
let registerErrorMessage = "";
let loginErrorMessage = "";
let loginReminderMessage = "";
let urlErrorMessage = "";
let loggedIn = false;

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "example"
  }
};

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

const generateRandomString = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomString = "";
  for (let i = 1; i <= 6; i++) {
    const randomNum = Math.floor(Math.random() * 62);
    randomString += characters[randomNum];
  }
  return randomString;
};

const findUserByEmail = email => {
  for (const user in users) {
    if (users[user].email === email) {
      return users[user];
    }
  }
  return undefined;
};

const findUserURLs = userID => { // this is the suggested urlsForUser(id) function but I like this name better because it maintains the syntax of first word being a verb
  const userURLs = {};
  for (const shortURL in urlDatabase) {
    const longURL = urlDatabase[shortURL].longURL;
    if (urlDatabase[shortURL].userID === userID) {
      userURLs[shortURL] = longURL;
    }
  }
  return userURLs;
};


// get homepage
app.get("/urls", (req, res) => {
  const userID = req.cookies["user_id"];
  const userURLs = findUserURLs(userID);

  const templateVars = {
    user: users[userID],
    urls: userURLs
  };

  res.render("urls_index", templateVars);
});

// post new url to homepage
app.post("/urls", (req, res) => {
  const userID = req.cookies["user_id"];
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
  if (loggedIn) {
    const userID = req.cookies["user_id"];
    const templateVars = {
      user: users[userID],
      urlErrorMessage
    };
    res.render("urls_new", templateVars);
    urlErrorMessage = "";
  } else {
    loginReminderMessage = "Please login to create a new URL";
    res.redirect("/login");
  }
});

// delete existing short URL from homepage
app.post("/urls/:shortURL/delete", (req, res) => {
  const userID = req.cookies["user_id"];
  const shortURL = req.params.shortURL;

  if (urlDatabase[shortURL].userID === userID) {
    delete urlDatabase[shortURL];
    res.redirect("/urls");
  }
});

// get page for existing short URL from homepage
app.get("/urls/:shortURL", (req, res) => {
  const userID = req.cookies["user_id"];
  const userURLs = findUserURLs(userID);
  const shortURL = req.params.shortURL;
  const longURL = userURLs[shortURL];

  if (!loggedIn) {
    loginReminderMessage = "Please login to view your URL";
    res.redirect("/login");
  } else if (!longURL) {
    urlErrorMessage = "Access to this URL is not permitted from your account\nYou can create your own URL here";
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
  const userID = req.cookies["user_id"];
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
// 'logout' and clear the appropriate user_id cookie
app.post("/logout", (req, res) => {
  loggedIn = false;
  res.clearCookie("user_id");
  res.redirect("/urls");
});

// get the 'register' page
app.get("/register", (req, res) => {
  const userID = req.cookies["user_id"];
  const templateVars = {
    user: users[userID],
    registerErrorMessage
  };
  res.render("urls_register", templateVars);
  registerErrorMessage = "";
});

// register a new email and password from the 'register' page
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    res.statusCode = 400;
    registerErrorMessage = `Error ${res.statusCode}: Please enter a valid email and password`;
    res.redirect("back");
  } else if (findUserByEmail(email)) {
    res.statusCode = 400;
    registerErrorMessage = `Error ${res.statusCode}: Email is already being used`;
    res.redirect("back");
  } else {
    const userID = generateRandomString();
    users[userID] = {
      id: userID,
      email,
      password
    };
    loggedIn = true;
    res.cookie("user_id", userID);
    res.redirect("/urls");
  }
});

// get the 'login' page
app.get("/login", (req, res) => {
  const userID = req.cookies["user_id"];
  const templateVars = {
    user: users[userID],
    loginErrorMessage,
    loginReminderMessage
  };
  res.render("urls_login", templateVars);
  loginErrorMessage = "";
  loginReminderMessage = "";
});

// 'login' with existing email and password
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = findUserByEmail(email);

  if (!email || !password) {
    res.statusCode = 400;
    loginErrorMessage = `Error ${res.statusCode}: Please enter a valid email and password`;
    res.redirect("back");
  } else if (!user) {
    res.statusCode = 403;
    loginErrorMessage = `Error ${res.statusCode}: Email cannot be found`;
    res.redirect("back");
  } else if (user.password !== password) {
    res.statusCode = 403;
    loginErrorMessage = `Error ${res.statusCode}: Password does not match email`;
    res.redirect("back");
  } else {
    loggedIn = true;
    res.cookie("user_id", user.id);
    res.redirect("/urls");
  }
});