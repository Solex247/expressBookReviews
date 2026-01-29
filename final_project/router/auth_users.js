const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./db/booksdb.js");
const regd_users = express.Router();

let users = [];

/**
 * Check if a username is already registered
 */
const isValid = (username) => {
  return users.some((user) => user.username === username);
};

/**
 * Authenticate a user with username and password
 */
const authenticatedUser = (username, password) => {
  return users.some(
    (user) => user.username === username && user.password === password,
  );
};

/**
 * Task 7: Login route for registered users
 */
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (authenticatedUser(username, password)) {
    // Create JWT token
    const accessToken = jwt.sign({ username }, "fingerprint_customer", {
      expiresIn: "1h",
    });

    // Save credentials in session
    req.session.authorization = {
      accessToken,
      username,
    };

    return res
      .status(200)
      .json({ message: "User successfully logged in", accessToken });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
});

/**
 * Task 8: Add or modify a book review
 * Only authenticated users can post a review
 */
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;

  if (!req.session.authorization) {
    return res.status(403).json({ message: "User not logged in" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!review) {
    return res.status(400).json({ message: "Review content required" });
  }

  const username = req.session.authorization.username;

  // Add or update review
  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review successfully added/updated",
    reviews: books[isbn].reviews,
  });
});

/**
 * Task 9: Delete a book review
 * Only the user who posted a review can delete it
 */
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  if (!req.session.authorization) {
    return res.status(403).json({ message: "User not logged in" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  const username = req.session.authorization.username;

  if (books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    return res.status(200).json({
      message: "Review deleted successfully",
      reviews: books[isbn].reviews,
    });
  } else {
    return res
      .status(404)
      .json({ message: "No review found for this user on the given ISBN" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
