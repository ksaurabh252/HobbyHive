const { createClient } = require("redis");

const client = createClient({
  url: process.env.REDIS_URI || "redis://localhost:6379",
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 100, 5000),
  },
});

client.on("error", (err) => console.error("Redis error:", err));

(async () => {
  try {
    await client.connect();
    console.log("Redis connected successfully");
  } catch (err) {
    console.error("Redis connection failed:", err);
    process.exit(1);
  }
})();

module.exports = client;
