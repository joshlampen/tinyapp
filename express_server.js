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

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "example"
  }
};

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

const findUserByEmail = email => {
  for (const user in users) {
    if (users[user].email === email) {
      return users[user];
    }
  }
  return undefined;
}


// get homepage
app.get("/urls", (req, res) => {
  const userID = req.cookies["user_id"];
  const templateVars = {
    user: users[userID],
    urls: urlDatabase,
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
  const userID = req.cookies["user_id"];
  const templateVars = {
    user: users[userID],
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
  const userID = req.cookies["user_id"];
  const templateVars = {
    user: users[userID],
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
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


// LOGIN AND LOGOUT
// 'logout' and clear the appropriate user_id cookie
app.post("/logout", (req, res) => {
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
    res.cookie("user_id", userID);
    res.redirect("/urls");
  }
});

// get the 'login' page
app.get("/login", (req, res) => {
  const userID = req.cookies["user_id"];
  const templateVars = {
    user: users[userID],
    loginErrorMessage
  };
  res.render("urls_login", templateVars);
  loginErrorMessage = "";
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
    res.cookie("user_id", user.id);
    res.redirect("/urls");
  }
});