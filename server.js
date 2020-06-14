// imports and setup
const index = require("./routes/index-router");
const register = require("./routes/register-router");
const login = require("./routes/login-router");
const logout = require("./routes/logout-router");
const urls = require("./routes/urls-router");
const newURL = require("./routes/new-url-router");
const showURL = require("./routes/show-url-router");
const deleteURL = require("./routes/delete-url-router");
const getURL = require("./routes/get-url-router");

const express = require("express");
const app = express();
app.use(index, register, login, logout, urls, newURL, showURL, deleteURL, getURL);
app.set("view engine", "ejs");

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}`);
});