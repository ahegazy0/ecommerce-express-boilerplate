const mongoose = require("mongoose");

const mongoConnection = () => {
  return mongoose
    .connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce_demo"
    )
    .then(() => {
      console.log("MongoDB Connection Established...");
    });
};

module.exports = {
  mongoConnection,
};
