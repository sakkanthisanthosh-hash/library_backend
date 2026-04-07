const router = require('express').Router();
const { getUsers, getUser, updateUser, toggleUserStatus } = require('../controllers/userController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', auth, adminOnly, getUsers);
router.get('/:id', auth, getUser);
router.put('/:id', auth, updateUser);
router.put('/:id/toggle-status', auth, adminOnly, toggleUserStatus);

module.exports = router;
