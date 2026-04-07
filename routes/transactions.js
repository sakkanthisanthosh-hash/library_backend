const router = require('express').Router();
const { issueBook, returnBook, getTransactions, payFine, getStats } = require('../controllers/transactionController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', auth, getTransactions);
router.get('/stats', auth, adminOnly, getStats);
router.post('/issue', auth, issueBook);
router.put('/return/:id', auth, adminOnly, returnBook);
router.put('/pay-fine/:id', auth, adminOnly, payFine);

module.exports = router;
