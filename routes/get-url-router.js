// imports and setup
const { urlDatabase, urlVisitors } = require("../databases");
const { getTime, getDate, generateRandomString, getIP, getURLVisitor } = require("../helpers");

const express = require("express");
const getURL = express.Router();


// router will manage GET requests for anyone who clicks on the short URL

// get long URL page from short URL
getURL.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const ipAddress = getIP(req); // I decided to use the user's IP address to determine if a visitor is unique, rather than using cookies
  const visitorID = generateRandomString();
  const visitTime = getTime();
  const visitDate = getDate();

  if (!urlDatabase[shortURL]) { // ensure an error message is sent if the URL does not exist
    res.send("Error: URL does not exist");
    res.end();
  } else {
    if (!getURLVisitor(ipAddress, shortURL, urlVisitors)) { // if the user has not visited the short URL before, add the IP to the visitors database and increment the counter
      urlVisitors[shortURL].push({
        ipAddress,
        visitorID,
        visitTime,
        visitDate
      });

      urlDatabase[shortURL].uniqueVisitors++;
    }

    urlDatabase[shortURL].hits++;
    
    const longURL = urlDatabase[shortURL].longURL;
    res.redirect(longURL);
  }
});


module.exports = getURL;