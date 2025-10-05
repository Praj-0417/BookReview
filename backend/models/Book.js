const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  coverImage: {
    type: String,
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

module.exports = mongoose.model('Book', BookSchema);
