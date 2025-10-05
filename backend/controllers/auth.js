const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
    }

    user = new User({
      name,
      email,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const Book = require('../models/Book');
    const Review = require('../models/Review');
    const mongoose = require('mongoose');

    const userId = new mongoose.Types.ObjectId(req.user.id);

    const books = await Book.aggregate([
      { $match: { addedBy: userId } },
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
      {
        $project: {
          reviews: 0,
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    const reviews = await Review.find({ userId })
      .populate('bookId', 'title author')
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      user,
      booksCount: books.length,
      reviewsCount: reviews.length,
      books,
      reviews,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateDetails = async (req, res) => {
    const { name, email } = req.body;
    try {
      const user = await User.findByIdAndUpdate(req.user.id, { name, email }, {
        new: true,
        runValidators: true
      });
  
      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
  };
