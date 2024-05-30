// Implement search functionality for auction items
async function searchItems(req, res) {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
  
    try {
      const results = await Item.find({ $text: { $search: query } }).exec();
      res.status(200).json(results);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
  