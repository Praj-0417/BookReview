const Book = require('../models/Book');
const Review = require('../models/Review');
const { validationResult } = require('express-validator');

exports.getBooks = async (req, res) => {
  // Pagination, search, filter and sorting
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 5;
  const search = req.query.search || '';
  const genre = req.query.genre || '';
  const sortBy = req.query.sortBy || ''; // 'year' or 'rating'

  const match = {};
  if (search) {
    match.$or = [
      { title: { $regex: search, $options: 'i' } },
      { author: { $regex: search, $options: 'i' } },
    ];
  }
  if (genre) {
    match.genre = genre;
  }

  const skip = (page - 1) * limit;

  try {
    const genresList = await Book.distinct('genre');
    // Aggregate to compute average rating per book
    const agg = [
      { $match: match },
      {
        $lookup: {
          from: 'reviews',
          localField: '_id',
          foreignField: 'bookId',
          as: 'reviews',
        },
      },
      {
        $addFields: {
          averageRating: { $ifNull: [{ $avg: '$reviews.rating' }, 0] },
          reviewsCount: { $size: '$reviews' },
        },
      },
    ];

    // Sorting
    if (sortBy === 'year') {
      agg.push({ $sort: { year: -1 } });
    } else if (sortBy === 'rating') {
      agg.push({ $sort: { averageRating: -1 } });
    } else {
      agg.push({ $sort: { _id: -1 } });
    }

    const facet = [
      { $skip: skip },
      { $limit: limit },
    ];

    const final = await Book.aggregate([...agg, { $facet: { data: facet, totalCount: [{ $count: 'count' }] } }]);

    const books = final[0].data;
    const total = final[0].totalCount[0] ? final[0].totalCount[0].count : 0;

    const pagination = {};
    if (skip + limit < total) pagination.next = { page: page + 1, limit };
    if (skip > 0) pagination.prev = { page: page - 1, limit };

    res.json({ success: true, count: books.length, pagination, total, data: books, genres: genresList });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, error: 'Book not found' });
    }

    const reviews = await Review.find({ bookId: req.params.id }).populate('userId', 'name');
    const ratings = reviews.map(review => review.rating);
    const averageRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;


    res.json({ success: true, data: { book, reviews, averageRating } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.addBook = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { title, author, description, genre, year } = req.body;
  const coverImage = req.file ? req.file.path : null;

  try {
    const book = await Book.create({
      title,
      author,
      description,
      genre,
      year,
      coverImage,
      addedBy: req.user.id,
    });
    res.status(201).json({ success: true, data: book });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    let book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, error: 'Book not found' });
    }

    if (book.addedBy.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: book });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, error: 'Book not found' });
    }

    if (book.addedBy.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    await book.remove();
    res.json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
