/* eslint-disable no-console */
const path = require("path");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const User = require("../models/User");
const Book = require("../models/Book");
const Review = require("../models/Review");
const users = require("../dummy-data/users");
const books = require("../dummy-data/books");
const reviews = require("../dummy-data/reviews");

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const hashPasswords = async (userData) => {
  const salt = await bcrypt.genSalt(10);
  return Promise.all(
    userData.map(async (user) => ({
      ...user,
      password: await bcrypt.hash(user.password, salt),
    }))
  );
};

const importData = async () => {
  try {
    await connectDB();

    await Review.deleteMany();
    await Book.deleteMany();
    await User.deleteMany();

    const hashedUsers = await hashPasswords(users);
    const createdUsers = await User.insertMany(hashedUsers);
    const userMap = createdUsers.reduce((acc, user) => {
      acc[user.email] = user;
      return acc;
    }, {});

    const bookDocs = books.map((book) => {
      const owner = userMap[book.addedByEmail];
      if (!owner) {
        throw new Error(`Missing owner for book ${book.title}`);
      }
      return {
        title: book.title,
        author: book.author,
        description: book.description,
        genre: book.genre,
        year: book.year,
        coverImage: book.coverImage,
        addedBy: owner._id,
      };
    });

    const createdBooks = await Book.insertMany(bookDocs);
    const bookMap = createdBooks.reduce((acc, book) => {
      acc[book.title] = book;
      return acc;
    }, {});

    const reviewDocs = reviews.map((review) => {
      const reviewer = userMap[review.userEmail];
      const book = bookMap[review.bookTitle];
      if (!reviewer || !book) {
        throw new Error(
          `Invalid review mapping for ${review.bookTitle} / ${review.userEmail}`
        );
      }
      return {
        rating: review.rating,
        reviewText: review.reviewText,
        userId: reviewer._id,
        bookId: book._id,
      };
    });

    if (reviewDocs.length) {
      await Review.insertMany(reviewDocs);
    }

    console.log("Sample data successfully imported.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    await Review.deleteMany();
    await Book.deleteMany();
    await User.deleteMany();

    console.log("All data destroyed.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
