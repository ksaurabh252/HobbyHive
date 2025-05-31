const mongoose = require("mongoose");

module.exports = async () => {
  await mongoose.connection.close();
  if (global.__MONGOSERVER__) {
    await global.__MONGOSERVER__.stop();
  }
};
