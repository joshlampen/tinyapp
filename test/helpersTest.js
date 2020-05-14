const { assert } = require('chai');
const { getUserByEmail, getUserURLs } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

const testURLDatabase = {
  b6UTxQ: {
    longURL: "https://www.firstexample.com",
    userID: "aJ48lW",
    visits: 5,
    uniqueVisitors: 3,
    dateMade: "May 14, 2020"
  },
  i3BoGr: {
    longURL: "https://www.secondexample.com",
    userID: "b5o2xJ",
    visits: 10,
    uniqueVisitors: 6,
    dateMade: "May 14, 2020"
  },
  b5oR46: {
    longURL: "https://www.thirdexample.com",
    userID: "aJ48lW",
    visits: 6,
    uniqueVisitors: 2,
    dateMade: "May 14, 2020"
  }
};

describe('getUserByEmail', function() {
  it('should return the appropriate user if the email is within the database', function() {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedOutput = {
      id: "userRandomID",
      email: "user@example.com",
      password: "purple-monkey-dinosaur"
    };
    assert.deepEqual(user, expectedOutput);
  });

  it('should return undefined if the email is not in the database', function() {
    const user = getUserByEmail("user3@example.com", testUsers);
    assert.strictEqual(user, undefined);
  });
});

describe('getUserURLs', function() {
  it('should return all short URLs that match the userID', function() {
    const userURLs = getUserURLs("aJ48lW", testURLDatabase);
    const expectedOutput = {
      b6UTxQ: {
        longURL: "https://www.firstexample.com",
        visits: 5,
        uniqueVisitors: 3,
        dateMade: "May 14, 2020"
      },
      b5oR46: {
        longURL: "https://www.thirdexample.com",
        visits: 6,
        uniqueVisitors: 2,
        dateMade: "May 14, 2020"
      }
    };
    assert.deepEqual(userURLs, expectedOutput);
  });

  it('should return an empty object if none of the short URLs match the userID', function() {
    const userURLs = getUserURLs("hb6Ils", testURLDatabase);
    assert.deepEqual(userURLs, {});
  });
});