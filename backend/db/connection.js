const mongoose = require('mongoose');

const connectDB = async () => {
  const conn = await mongoose.connect(
    'mongodb+srv://mariyazaveri15:!Pjbn5716@cluster0.tzntpap.mongodb.net/?retryWrites=true&w=majority',
    {}
  );
  console.log(`Mongo db Connected ${conn.connection.host}`.cyan.underline.bold);
};

module.exports = connectDB;
