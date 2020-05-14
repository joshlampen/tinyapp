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
  // hits: 0,
  // uniqueVisitors: 0
  // dateMade: May 14, 2020
  // }
};

const urlVisitors = {
  // entries are an array of IP visitors for each short URL, as seen in the example entry below:
  // b6UTxQ: ['::ffff:10.0.2.2', '[another IP]', '[another IP]']
};

module.exports = { resMessages, users, urlDatabase, urlVisitors };