require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const socketio = require("socket.io");
const jwt = require("jsonwebtoken");
const client = require("./config/redis");
const matchmakingRoutes = require("./routes/matchmaking");
const authRoutes = require("./routes/auth");
const hobbyRoutes = require("./routes/hobby");
const groupRoutes = require("./routes/Group");
const eventRoutes = require("./routes/Event");
const resourceRoutes = require("./routes/resource");
const limiter = require("./middlewares/rateLimit");
const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api", limiter);

// Socket.IO Authentication
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("Authentication error"));

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return next(new Error("Invalid token"));
    socket.userId = decoded.id;
    next();
  });
});

// Socket.IO Connection Handler
io.on("connection", (socket) => {
  console.log(`User ${socket.userId} connected`);

  socket.on("joinGroup", (groupId) => {
    socket.join(groupId);
    console.log(`User ${socket.userId} joined group ${groupId}`);
  });

  socket.on("sendMessage", ({ groupId, message }) => {
    io.to(groupId).emit("newMessage", {
      userId: socket.userId,
      message,
      timestamp: new Date(),
    });
  });

  socket.on("disconnect", () => {
    console.log(`User ${socket.userId} disconnected`);
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/hobbies", hobbyRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/matchmaking", matchmakingRoutes);

// Run daily at midnight (using node-cron)
if (process.env.NODE_ENV === "production") {
  const cron = require("node-cron");
  const { updateSuggestions } = require("./services/matchmaking");

  cron.schedule("0 0 * * *", async () => {
    console.log("Running daily matchmaking...");
    const users = await User.find();
    await Promise.all(users.map((user) => updateSuggestions(user._id)));
  });
}
// Database Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = { app, io };
