const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth');
const { check } = require('express-validator');

router.post(
  '/register',
  [
    check('name', 'Name is required and must be at least 3 characters').not().isEmpty().isLength({ min: 3 }),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  register
);
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  login
);

// Optional: endpoint to get current user info (requires auth middleware)
const { protect } = require('../middleware/auth');
const { me, updateDetails } = require('../controllers/auth');
router.get('/me', protect, me);
router.put('/updatedetails', protect, updateDetails);

module.exports = router;
