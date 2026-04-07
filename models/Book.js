const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  description: { type: String },
  totalCopies: { type: Number, required: true, default: 1 },
  availableCopies: { type: Number, required: true, default: 1 },
  publisher: { type: String },
  publishedYear: { type: Number },
  coverImage: { type: String }
}, { timestamps: true });

bookSchema.index({ title: 'text', author: 'text', category: 'text', isbn: 'text' });

module.exports = mongoose.model('Book', bookSchema);
