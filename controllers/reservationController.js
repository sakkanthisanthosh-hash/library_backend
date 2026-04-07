const Reservation = require('../models/Reservation');
const Book = require('../models/Book');

exports.reserveBook = async (req, res) => {
  try {
    const { bookId } = req.body;
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const existing = await Reservation.findOne({ user: req.user.id, book: bookId, status: 'pending' });
    if (existing) return res.status(400).json({ message: 'Already reserved this book' });

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 3);

    const reservation = await Reservation.create({
      user: req.user.id, book: bookId, expiryDate
    });

    res.status(201).json(await reservation.populate(['user', 'book']));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getReservations = async (req, res) => {
  try {
    const query = req.user.role !== 'admin' ? { user: req.user.id } : {};
    if (req.query.status) query.status = req.query.status;

    const reservations = await Reservation.find(query)
      .populate('user', 'name email')
      .populate('book', 'title author isbn')
      .sort({ createdAt: -1 });

    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ message: 'Reservation not found' });

    if (req.user.role !== 'admin' && reservation.user.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized' });

    reservation.status = 'cancelled';
    await reservation.save();
    res.json(reservation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.fulfillReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status: 'fulfilled' },
      { new: true }
    ).populate(['user', 'book']);
    if (!reservation) return res.status(404).json({ message: 'Reservation not found' });
    res.json(reservation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
