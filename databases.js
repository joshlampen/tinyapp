const resMessages = {
  registerErrorMessage: "",
  loginErrorMessage: "",
  loginReminderMessage: "",
  urlErrorMessage: ""
};

const users = {
  // example entry below:
  // "userRandomID": {
  //   id: "userRandomID",
  //   email: "user@example.com",
  //   hashedPassword: "example"
  // }
};

const urlDatabase = {
  // example entry below:
  // b6UTxQ: {
  // longURL: "https://www.tsn.ca",
  // userID: "aJ48lW",
  // visits: 0,
  // uniqueVisitors: 0
  // dateMade: May 14, 2020
  // }
};

const urlVisitors = {
  // entries are an array of objects for each short URL, with each object containing the IP, visitor ID, and visit time - example below:
  // b6UTxQ: [
  // {ipAddress: '::ffff:10.0.2.2', visitorID: 'jU8hn1', visitTime: '10:29PM UTC', visitDate: 'May 14, 2020'}
  // { ... }
  // ]
};

module.exports = { resMessages, users, urlDatabase, urlVisitors };