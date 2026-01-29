const express = require("express");
const axios = require("axios");
let books = require("./db/booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

/**
 * Register a new user (UNCHANGED)
 */
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username, password });
      return res.status(200).json({ message: "User successfully registered" });
    } else {
      return res.status(409).json({ message: "User already exists" });
    }
  }
  return res.status(400).json({ message: "Username and password required" });
});

/**
 * ============================
 * Task 10
 * Get all books (async-await + Axios)
 * ============================
 */
public_users.get("/", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5000/");
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

/**
 * ============================
 * Task 11
 * Get book details by ISBN (async-await + Axios)
 * ============================
 */
public_users.get("/isbn/:isbn", async (req, res) => {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({ message: "Book not found" });
  }
});

/**
 * ============================
 * Task 12
 * Get book details by Author (async-await + Axios)
 * ============================
 */
public_users.get("/author/:author", async (req, res) => {
  const author = req.params.author;
  try {
    const response = await axios.get(
      `http://localhost:5000/author/${author}`
    );
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({ message: "No books found for this author" });
  }
});

/**
 * ============================
 * Task 13
 * Get book details by Title (async-await + Axios)
 * ============================
 */
public_users.get("/title/:title", async (req, res) => {
  const title = req.params.title;
  try {
    const response = await axios.get(
      `http://localhost:5000/title/${title}`
    );
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

/**
 * Get book reviews (unchanged)
 */
public_users.get("/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }
  return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;
