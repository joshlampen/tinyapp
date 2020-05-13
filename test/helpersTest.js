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
  b6UTxQ: { longURL: "https://www.firstexample.com", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.secondexample.com", userID: "b5o2xJ" },
  b5oR46: { longURL: "https://www.thirdexample.com", userID: "aJ48lW" }
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
      b6UTxQ: "https://www.firstexample.com",
      b5oR46: "https://www.thirdexample.com"
    };
    assert.deepEqual(userURLs, expectedOutput);
  });

  it('should return an empty object if none of the short URLs match the userID', function() {
    const userURLs = getUserURLs("hb6Ils", testURLDatabase);
    assert.deepEqual(userURLs, {});
  });
});