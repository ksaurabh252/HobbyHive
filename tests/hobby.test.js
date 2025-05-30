const { request, getAuthToken } = require("./utils");

describe("Hobby API", () => {
  let token;

  beforeAll(async () => {
    token = await getAuthToken();
  });

  test("Create new hobby", async () => {
    const res = await request
      .post("/api/hobbies")
      .set("x-auth-token", token)
      .send({
        name: "Photography",
        description: "Art of capturing light",
        skillLevel: "Beginner",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
  });

  test("Get all hobbies", async () => {
    const res = await request.get("/api/hobbies").set("x-auth-token", token);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });
});
