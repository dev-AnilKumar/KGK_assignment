// Implement filtering functionality for auction items
async function filterItems(req, res) {
    const status = req.query.status;
    if (!status) {
      return res.status(400).json({ message: 'Status filter is required' });
    }
  
    try {
      const results = await Item.find({ status: status }).exec();
      res.status(200).json(results);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
  