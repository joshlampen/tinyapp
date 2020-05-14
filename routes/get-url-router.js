// imports and setup
const { urlDatabase, urlVisitors } = require("../databases");
const { getIP } = require("../helpers");

const express = require("express");
const getURL = express.Router();


// router will manage GET requests for anyone who clicks on the short URL

// get long URL page from short URL
getURL.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const ipAddress = getIP(req);

  
  if (!urlDatabase[shortURL]) { // ensure an error message is sent if the URL does not exist
    res.send("Error: URL does not exist");
    res.end();
  } else {
    // if the user has not visited the short URL before, add the IP to the database and increment the unique visitors counter
    if (!urlVisitors[shortURL].includes(ipAddress)) {
      urlVisitors[shortURL].push(ipAddress);
      urlDatabase[shortURL].uniqueVisitors++;
    }

    urlDatabase[shortURL].hits++;
    
    const longURL = urlDatabase[shortURL].longURL;
    res.redirect(longURL);
  }
});


module.exports = getURL;