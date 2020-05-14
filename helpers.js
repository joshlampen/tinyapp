const dateFormat = require('dateformat');

const getTime = () => {
  const time = dateFormat(new Date(), "UTC: h:MM TT Z"); // the above import enables this type of formatting
  return time;
};

const getDate = () => {
  const date = dateFormat(new Date(), "mmmm dd, yyyy");
  return date;
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

// the below function was based on this Github post: https://gist.github.com/qiao/1626318
const getIP = req => { // IP will be retrieved using the client's request
  let ipAddress;
  let forwardedIPs = req.header('x-forwarded-for'); // request may be forwarded from local web server

  // the header may return multiple IPs (in string form); the first one (the client IP) will be taken regardless
  if (forwardedIPs) {
    ipAddress = forwardedIPs.split(',')[0];
  } else if (!ipAddress) { // if the request was not forwarded, it came from the remote address
    ipAddress = req.connection.remoteAddress;
  }
  return ipAddress;
};

// the below function checks if a given IP address has visited a given short URL
const getURLVisitor = (ipAddress, shortURL, database) => {
  for (const visitor of database[shortURL]) {
    if (visitor.ipAddress === ipAddress) {
      return true;
    }
  }
  return false;
};

const getUserByEmail = (email, database) => {
  for (const user in database) {
    if (database[user].email === email) {
      return database[user];
    }
  }
};

const getUserURLs = (userID, database) => {
  const userURLs = {};
  for (const shortURL in database) {
    const longURL = database[shortURL].longURL;
    const hits = database[shortURL].hits;
    const uniqueVisitors = database[shortURL].uniqueVisitors;
    const dateMade = database[shortURL].dateMade;

    if (database[shortURL].userID === userID) {
      userURLs[shortURL] = {
        longURL,
        hits,
        uniqueVisitors,
        dateMade
      };
    }
  }
  return userURLs;
};


module.exports = { getTime, getDate, generateRandomString, getIP, getURLVisitor, getUserByEmail, getUserURLs };