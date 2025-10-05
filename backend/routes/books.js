const express = require('express');
const router = express.Router();
const {
  getBooks,
  getBook,
  addBook,
  updateBook,
  deleteBook,
} = require('../controllers/books');
const { protect } = require('../middleware/auth');
const { check } = require('express-validator');

const upload = require('../middleware/upload');

router.route('/').get(getBooks).post(
  protect,
  upload,
  [
    check('title', 'Title is required').not().isEmpty(),
    check('author', 'Author is required').not().isEmpty(),
  ],
  addBook
);
router
  .route('/:id')
  .get(getBook)
  .put(protect, updateBook)
  .delete(protect, deleteBook);

module.exports = router;
