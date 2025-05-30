const { request, getAuthToken } = require("./utils");

describe("Auth API", () => {
  test("Register new user", async () => {
    const res = await request.post("/api/auth/register").send({
      username: "newuser",
      email: "new@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
  });

  test("Login existing user", async () => {
    const res = await request.post("/api/auth/login").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});
