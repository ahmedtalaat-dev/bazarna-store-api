const mongoose = require("mongoose");

const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then((conn) => {
      console.log(`Database Connected successfully: ${conn.connection.host}`);
    })
    .catch((err) => {
      console.error(`Database connection Error: ${err}`);
      process.exit(1);
    });
};

module.exports = connectDB;
