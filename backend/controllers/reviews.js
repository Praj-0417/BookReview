const Review = require('../models/Review');
const Book = require('../models/Book');

exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ bookId: req.params.bookId }).populate('userId', 'name');
    res.json({ success: true, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.addReview = async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (!book) {
      return res.status(404).json({ success: false, error: 'Book not found' });
    }

    // Prevent a user from creating multiple reviews for the same book
    const existing = await Review.findOne({ bookId: req.params.bookId, userId: req.user.id });
    if (existing) {
      return res.status(400).json({ success: false, error: 'You have already reviewed this book. Use the update review endpoint to modify your review.' });
    }

    const review = await Review.create({
      rating: req.body.rating,
      reviewText: (req.body.reviewText || '').trim(),
      bookId: req.params.bookId,
      userId: req.user.id,
    });

    res.status(201).json({ success: true, data: review });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.updateReview = async (req, res) => {
  try {
    let review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, error: 'Review not found' });
    }

    if (review.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    const payload = {
      rating: req.body.rating,
      reviewText: (req.body.reviewText || '').trim(),
    };

    review = await Review.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: review });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, error: 'Review not found' });
    }

    if (review.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    await review.remove();
    res.json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
