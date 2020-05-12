// imports and setup
const express = require("express");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const cookieParser = require("cookie-parser");
app.use(cookieParser());


// constants --> move to other file
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
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


// get homepage
app.get("/urls", (req, res) => {
  let templateVars = {
    username: req.cookies["username"],
    urls: urlDatabase,
    registered: true
  };
  res.render("urls_index", templateVars);
});

// post new url to homepage
app.post("/urls", (req, res) => {
  const key = generateRandomString();
  urlDatabase[key] = req.body.longURL;
  res.redirect(`/urls/${key}`);
});

// get page for creating new url
app.get("/urls/new", (req, res) => {
  let templateVars = {
    username: req.cookies["username"],
    registered: true
  };
  res.render("urls_new", templateVars);
});

// delete existing short URL from homepage
app.post("/urls/:shortURL/delete", (req, res) => {
  const key = req.params.shortURL;
  delete urlDatabase[key];
  res.redirect("/urls");
});

// get page for existing short URL from homepage
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    username: req.cookies["username"],
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    registered: true
  };
  res.render("urls_show", templateVars);
});

// replace existing short URL on homepage with new long URL
app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const newLongURL = req.body.longURL;
  urlDatabase[shortURL] = newLongURL;
  res.redirect("/urls");
});

// get long URL page from short URL
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

// 'login' and add a new username
app.post("/login", (req, res) => {
  res.cookie("username", req.body.username);
  res.redirect("/urls");
});

// 'logout' and delete a username
app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
});

// get the 'register' page
app.get("/register", (req, res) => {
  let templateVars = {
    registered: false
  };
  res.render("urls_register", templateVars);
});

// register a new email and password from the 'register' page
// app.post("/register", (req, res) => {
//   res.cookie("email", req.body.email);
//   res.cookie("password", req.body.password);
// });

// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});