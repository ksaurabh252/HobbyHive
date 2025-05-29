const { RateLimiterRedis } = require("rate-limiter-flexible");
const client = require("../config/redis");

const rateLimiter = new RateLimiterRedis({
  storeClient: client,
  points: 100, // 100 requests
  duration: 15 * 60, // per 15 minutes
  keyPrefix: "rl", // Redis key prefix
});

const rateLimitMiddleware = (req, res, next) => {
  rateLimiter
    .consume(req.ip)
    .then(() => {
      next();
    })
    .catch(() => {
      res.status(429).json({
        message: "Too many requests, please try again later",
      });
    });
};

module.exports = rateLimitMiddleware;
