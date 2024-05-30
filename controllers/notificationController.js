
const db = require('../config/dbconfig');



const getNotifications = async (req, res) => {
  try {
    const { id } = req.user;
    const notifications = await db.query('SELECT * FROM notifications WHERE user_id = ?', [id]);
    res.status(200).json({ notifications });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

const markNotificationasRead = async (req, res) => {
  try {
    const { id } = req.user;
    await db.query('UPDATE notifications SET is_read = ? WHERE user_id = ?', [true, id]);

    res.status(200).json({ message: 'Notifications marked as read' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

module.exports={markNotificationasRead,getNotifications};
