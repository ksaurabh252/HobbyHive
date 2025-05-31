const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

module.exports = async () => {
  const mongoServer = await MongoMemoryServer.create({
    spawnTimeoutMS: 30000, // 30 seconds
  });
  process.env.MONGODB_URI = mongoServer.getUri();
  global.__MONGOSERVER__ = mongoServer;
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};
