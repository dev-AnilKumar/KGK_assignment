// controllers/bidController.js


const db = require('../config/dbconfig')

const bidsforItem = async () => {
  try {
    const { id } = req.params;

    const bids = await db.query('SELECT * FROM bids WHERE item_id = ?', [id]);

    return res.status(200).json({ bids });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

const placeBid = async (req, res) => {
  try {
    const { id } = req.params;
    const { bid_amount } = req.body;
    const { username } = req.user;
    if (!bid_amount || isNaN(bid_amount) || bid_amount <= 0) {
      return res.status(400).json({ message: 'Invalid bid amount' });
    }

    const item = db.query('SELECT * FROM items WHERE id = ? AND end_time > NOW()', [id]);
    if (item.length === 0) {
      res.status(404).json({ error: 'Item not found or auction ended' });
    }

    if (bid_amount <= item.current_price) {
      return res.status(400).json({ message: 'Bid amount must be greater than current price' });
    }

    const userId = await db.query('SELECT id FROM users WHERE username = ?', [username])

    await db.query('INSERT INTO bids (item_id, user_id, bid_amount) VALUES (?, ?, ?)', [id, userId, bid_amount]);

    await db.query('UPDATE items SET current_price = ? WHERE id = ?', [bid_amount, id]);

    const data = { id, userId, bid_amount };
    req.app.get('io').emit('update', data);

    res.status(201).json({ message: 'Bid placed successfully' });
  } catch (error) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = { placeBid, bidsforItem }
