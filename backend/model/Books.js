const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  bookTitle: {
    required: [true, 'Please enter a book title'],
    trim: true,
    type: String,
  },
  authorName: {
    type: String,
    trim: true,
    required: true,
  },
  price: {
    type: Number,
    min: 0,
    required: true,
  },
  genre: {
    type: [String],
    required: true,
    enum: ['Fiction', 'Non Fiction', 'Other'],
  },
  pages: {
    type: Number,
    required: true,
    min: 0,
  },
  firstPublishedDate: {
    type: Date,
  },
  shelf: {
    type: String,
    default: 'None',
    enum: ['Want to read', 'Currently reading', 'Read', 'Abandoned', 'None'],
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  review: {
    type: String,
    maxlength: 500,
  },
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Book', BookSchema);
