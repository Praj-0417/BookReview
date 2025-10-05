const express = require('express');
const router = express.Router();
const {
  getReviews,
  addReview,
  updateReview,
  deleteReview,
} = require('../controllers/reviews');
const { protect } = require('../middleware/auth');

router.route('/:bookId').get(getReviews).post(protect, addReview);
router.route('/:id').put(protect, updateReview).delete(protect, deleteReview);

module.exports = router;
