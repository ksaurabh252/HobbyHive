// Environment & Modules

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const socketio = require("socket.io");
const jwt = require("jsonwebtoken");

//  Middleware & Configs
const limiter = require("./middlewares/rateLimit");
const client = require("./configs/redis.config");

// Route Imports
const authRoutes = require("./routes/auth.routes");
const hobbyRoutes = require("./routes/hobby.routes");
const groupRoutes = require("./routes/group.routes");
const eventRoutes = require("./routes/event.routes");
const resourceRoutes = require("./routes/resource.routes");
const matchmakingRoutes = require("./routes/matchmaking.routes");
const skillExchangeRoutes = require("./routes/skillExchange.routes");
const gamificationRoutes = require("./routes/gamification.routes");

// App Setup
const app = express();
app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV !== "test") {
  app.use("/api", limiter);
}

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/hobbies", hobbyRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/matchmaking", matchmakingRoutes);
app.use("/api/skill-exchange", skillExchangeRoutes);
app.use("/api/gamification", gamificationRoutes);

// Matchmaking Cron (Production Only)
if (process.env.NODE_ENV === "production") {
  const cron = require("node-cron");
  const { updateSuggestions } = require("./services/matchmaking");
  const User = require("./models/User.model");

  cron.schedule("0 0 * * *", async () => {
    console.log("Running daily matchmaking...");
    const users = await User.find();
    await Promise.all(users.map((user) => updateSuggestions(user._id)));
  });
}

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

module.exports = app;

//  Start Server (Non-Test Mode)
if (process.env.NODE_ENV !== "test") {
  const server = http.createServer(app);

  //  Socket.io Setup
  const io = socketio(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  // JWT Auth Middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Authentication error"));

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return next(new Error("Invalid token"));
      socket.userId = decoded.id;
      next();
    });
  });

  // Socket Events
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

    socket.on("skillExchangeMatched", ({ exchangeId, matchedWithId }) => {
      io.to(`user_${exchangeId.user}`).emit("exchangeMatched", {
        message: "Your skill exchange has been matched!",
        matchedExchange: matchedWithId,
      });
      io.to(`user_${matchedWithId.user}`).emit("exchangeMatched", {
        message: "Your skill exchange has been matched!",
        matchedExchange: exchangeId,
      });
    });

    socket.on("disconnect", () => {
      console.log(`User ${socket.userId} disconnected`);
    });
  });

  // Start HTTP Server
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}
