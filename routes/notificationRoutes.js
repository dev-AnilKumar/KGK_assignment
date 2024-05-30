// routes/notificationRoutes.js

const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { getNotifications, markNotificationasRead } = require('../controllers/notificationController');
const router = express.Router();

router.get('/', authMiddleware, getNotifications);
router.post('/mark-read', authMiddleware, markNotificationasRead);

module.exports = router;
