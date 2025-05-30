const request = require("supertest");
const app = require("../app");

let authToken;

const getAuthToken = async () => {
  if (authToken) return authToken;

  const res = await request(app).post("/api/auth/register").send({
    username: "testuser",
    email: "test@example.com",
    password: "password123",
  });

  authToken = res.body.token;
  return authToken;
};

module.exports = {
  getAuthToken,
  request: request(app),
};
