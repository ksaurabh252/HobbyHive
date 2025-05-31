const request = require("supertest");
const app = require("../app");

describe("Auth API", () => {
  it("should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "testuser",
      email: "testuser@example.com",
      password: "password123",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
  });

  it("should login an existing user", async () => {
    await request(app).post("/api/auth/register").send({
      username: "loginuser",
      email: "loginuser@example.com",
      password: "password123",
    });
    const res = await request(app).post("/api/auth/login").send({
      email: "loginuser@example.com",
      password: "password123",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
