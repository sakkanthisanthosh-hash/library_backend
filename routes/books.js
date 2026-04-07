const router = require('express').Router();
const { getBooks, getBook, createBook, updateBook, deleteBook, getCategories } = require('../controllers/bookController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/categories', getCategories);
router.get('/', getBooks);
router.get('/:id', getBook);
router.post('/', auth, adminOnly, createBook);
router.put('/:id', auth, adminOnly, updateBook);
router.delete('/:id', auth, adminOnly, deleteBook);

module.exports = router;
