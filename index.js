
const express = require('express');
const socketio = require('socket.io');
const dotenv = require("dotenv");
const dbConnect = require("./config/dbconfig");
const userRoute = require("./routes/userRoutes");
const bidRoute = require("./routes/bidRoutes");
const itemRoute = require("./routes/itemRoutes");
const notificationRoute = require("./routes/notificationRoutes");
const notFound = require('./utils/errorHandler')

dotenv.config();

const app = express();
const server = require('http').Server(app);
const io = socketio(server);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT || 5000;

app.use('/users', userRoute);
app.use('/items', itemRoute);
app.use('/items', bidRoute);
app.use('/notifications', notificationRoute);



dbConnect.query("SELECT 1")
  .then(() => {
    console.log('db connected succesfully');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => console.log('db failed' + err))



app.use(notFound)
