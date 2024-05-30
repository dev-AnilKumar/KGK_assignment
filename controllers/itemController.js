// controllers/itemController.js

const db = require('../config/dbconfig');


const getAllItems = async (req, res) => {
  try {
    const { page = 1, limit = 10, } = req.query;
    const offset = (page - 1) * limit;

    const items = await db.query('SELECT * FROM items LIMIT ?, ?', [offset, limit]);
    res.status(200).json({ items });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await db.query('SELECT * FROM items WHERE id = ?', [id]);
    if (item.length === 0) {
      return res.status(404).json({ message: 'Item not found.' });
    }
    res.status(200).json({ item });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const createItem = async (req, res) => {
  try {
    const { name, description, starting_price, end_time } = req.body;
    const image_url = req?.file?.filename || null;

    await db.query('INSERT INTO items SET ?', { name, description, starting_price, end_time, image_url });

    res.status(201).json({ message: 'Item created successfully.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Internal server error.' });
  }
};


const updateItem = async (req, res) => {
  try {
    const { id } = req.params;

    const existingItem = await db.query('SELECT * FROM items WHERE id = ?', [id]);
    if (existingItem.length === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const { name, description, starting_price, end_time, image_url } = req.body;

    await db.query('UPDATE items SET name = ?, description = ?, starting_price = ?, end_time = ?, image_url = ? WHERE id = ?',
      [name, description, starting_price, end_time, image_url, id]);

    res.status(200).json({ message: 'Item updated successfully.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Internal server error.' });
  }
};


const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    const existingItem = await db.query('SELECT * FROM items WHERE id = ?', [id]);
    if (existingItem.length === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }

    await pool.query('DELETE FROM items WHERE id = ?', [id]);

    res.status(200).json({ message: 'Item deleted successfully.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Internal server error.' });
  }
};


module.exports = { getAllItems, getItemById, createItem, updateItem, deleteItem };
