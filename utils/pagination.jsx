// Implement pagination for retrieving auction items
async function getItems(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    if (endIndex < await Item.countDocuments().exec()) {
        results.next = {
            page: page + 1,
            limit: limit
        };
    }

    if (startIndex > 0) {
        results.previous = {
            page: page - 1,
            limit: limit
        };
    }

    try {
        results.results = await Item.find().limit(limit).skip(startIndex).exec();
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
