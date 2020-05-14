const dateFormat = require('dateformat');

const getDate = () => {
  dateFormat.masks.myFormat = 'mmmm dd, yyyy'; // the above import enables this type of formatting
  const date = dateFormat(new Date(), "myFormat");
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

module.exports = { getDate, generateRandomString, getUserByEmail, getUserURLs };