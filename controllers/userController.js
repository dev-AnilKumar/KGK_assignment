
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require("../config/dbconfig")

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userExists = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (userExists.length > 0) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await db.query('INSERT INTO users SET ?', { username, email, password: hashedPassword });

    const token = jwt.sign({ id: user[0].id, username: user[0].username }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ message: 'User registered successfully.' }, { token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error.' });
  }
}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (user.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const payload = {
      user: {
        id: user[0].id,
        username: user[0].username,
        email: user[0].email,
        role: user[0].role
      }
    };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' }, (err, token) => {
      if (err) throw err;
      res.status(200).json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({ user });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Internal server error.' });
  }
};


module.exports = { registerUser, loginUser, getProfile };
