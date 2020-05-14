// imports and setup
const { urlDatabase } = require("../constants");

const express = require("express");
const getURL = express.Router();


// router will manage GET requests for anyone who clicks on the short URL

// get long URL page from short URL
getURL.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;

  if (!urlDatabase[shortURL]) { // ensure an error message is sent if the URL does not exist
    res.send("Error: URL does not exist");
    res.end();
  } else {
    urlDatabase[shortURL].hits++;
    
    const longURL = urlDatabase[shortURL].longURL;
    res.redirect(longURL);
  }
});


module.exports = getURL;