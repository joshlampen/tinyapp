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

const getUserURLs = (userID, database) => { // this is the suggested urlsForUser(id) function
  const userURLs = {};
  for (const shortURL in database) {
    const longURL = database[shortURL].longURL;
    if (database[shortURL].userID === userID) {
      userURLs[shortURL] = longURL;
    }
  }
  return userURLs;
};

module.exports = { generateRandomString, getUserByEmail, getUserURLs };