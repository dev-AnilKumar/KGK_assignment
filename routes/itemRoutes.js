// routes/itemRoutes.js

const express = require('express');
const { getAllItems, getItemById, createItem, updateItem, deleteItem } = require('../controllers/itemController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', getAllItems);
router.get('/:id', getItemById);
router.post('/', authMiddleware, upload.single('file'), createItem);
router.put('/:id', authMiddleware, updateItem);
router.delete('/:id', authMiddleware, deleteItem);

module.exports = router;
