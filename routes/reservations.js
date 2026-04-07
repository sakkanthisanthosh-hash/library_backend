const router = require('express').Router();
const { reserveBook, getReservations, cancelReservation, fulfillReservation } = require('../controllers/reservationController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', auth, getReservations);
router.post('/', auth, reserveBook);
router.put('/cancel/:id', auth, cancelReservation);
router.put('/fulfill/:id', auth, adminOnly, fulfillReservation);

module.exports = router;
