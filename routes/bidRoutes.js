
const express = require('express');
const router = express.Router();
const { placeBid, bidsforItem } = require('../controllers/bidController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/:itemId/bids', bidsforItem);
router.post('/:itemId/bids', authMiddleware, placeBid);

module.exports = router;
