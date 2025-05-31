const mongoose = require("mongoose"),
  connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URI),
        console.log("MongoDB connected");
    } catch (o) {
      console.error(o.message), process.exit(1);
    }
  };
module.exports = connectDB;
