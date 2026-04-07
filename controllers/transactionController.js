const Transaction = require('../models/Transaction');
const Book = require('../models/Book');

const ISSUE_DAYS = 14;

exports.issueBook = async (req, res) => {
  try {
    const { bookId, userId } = req.body;
    const targetUserId = (req.user.role === 'admin' && userId) ? userId : req.user.id;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.availableCopies < 1) return res.status(400).json({ message: 'No copies available' });

    const existing = await Transaction.findOne({ user: targetUserId, book: bookId, status: 'issued' });
    if (existing) return res.status(400).json({ message: 'Book already issued to this user' });

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + ISSUE_DAYS);

    const transaction = await Transaction.create({ user: targetUserId, book: bookId, dueDate });
    book.availableCopies -= 1;
    await book.save();

    res.status(201).json(await transaction.populate(['user', 'book']));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.returnBook = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    if (transaction.status === 'returned') return res.status(400).json({ message: 'Book already returned' });

    const returnDate = new Date();
    const dueDate = new Date(transaction.dueDate);
    let fine = 0;

    if (returnDate > dueDate) {
      const overdueDays = Math.ceil((returnDate - dueDate) / (1000 * 60 * 60 * 24));
      fine = overdueDays * Number(process.env.FINE_PER_DAY);
    }

    transaction.returnDate = returnDate;
    transaction.fine = fine;
    transaction.status = 'returned';
    await transaction.save();

    await Book.findByIdAndUpdate(transaction.book, { $inc: { availableCopies: 1 } });

    res.json(await transaction.populate(['user', 'book']));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const { status, userId, page = 1, limit = 10 } = req.query;
    const query = {};

    if (req.user.role !== 'admin') query.user = req.user.id;
    else if (userId) query.user = userId;

    if (status) query.status = status;

    // Auto-mark overdue
    await Transaction.updateMany(
      { status: 'issued', dueDate: { $lt: new Date() } },
      { status: 'overdue' }
    );

    const transactions = await Transaction.find(query)
      .populate('user', 'name email')
      .populate('book', 'title author isbn')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Transaction.countDocuments(query);
    res.json({ transactions, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.payFine = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { finePaid: true },
      { new: true }
    ).populate(['user', 'book']);
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const totalIssued = await Transaction.countDocuments({ status: 'issued' });
    const totalOverdue = await Transaction.countDocuments({ status: 'overdue' });
    const totalReturned = await Transaction.countDocuments({ status: 'returned' });
    const finesPending = await Transaction.aggregate([
      { $match: { fine: { $gt: 0 }, finePaid: false } },
      { $group: { _id: null, total: { $sum: '$fine' } } }
    ]);

    res.json({
      totalIssued,
      totalOverdue,
      totalReturned,
      totalFinesPending: finesPending[0]?.total || 0
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
