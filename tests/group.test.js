const { request, getAuthToken } = require("./utils");

describe("Group API", () => {
  let token;
  let groupId;

  beforeAll(async () => {
    token = await getAuthToken();
  });

  test("Create group", async () => {
    const res = await request
      .post("/api/groups")
      .set("x-auth-token", token)
      .send({
        name: "Photography Enthusiasts",
        description: "Group for photography lovers",
        hobby: "640a8b8a8b8a8b8a8b8a8b8a", // Mock hobby ID
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    groupId = res.body._id;
  });

  test("Add member to group", async () => {
    // First create another test user
    const userRes = await request.post("/api/auth/register").send({
      username: "testuser2",
      email: "test2@example.com",
      password: "password123",
    });

    const res = await request
      .post(`/api/groups/${groupId}/members`)
      .set("x-auth-token", token)
      .send({ userId: userRes.body.user._id });

    expect(res.statusCode).toBe(200);
    expect(res.body.members.length).toBeGreaterThan(0);
  });
});
