const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../app");

let token, groupId;

beforeAll(async () => {
  const res = await request(app).post("/api/auth/register").send({
    username: "groupuser",
    email: "groupuser@example.com",
    password: "password123",
  });
  token = res.body.token;
});

describe("Group API", () => {
  it("should create a group", async () => {
    const hobbyRes = await request(app)
      .post("/api/hobbies")
      .set("x-auth-token", token)
      .send({
        name: "Gardening",
        description: "All about gardening",
        skillLevel: "Beginner",
      });
    const hobbyId = hobbyRes.body._id;

    const res = await request(app)
      .post("/api/groups")
      .set("x-auth-token", token)
      .send({
        name: "Gardeners",
        description: "Group for gardeners",
        hobby: hobbyId,
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("Gardeners");
    groupId = res.body._id;
  });

  it("should add a member to the group", async () => {
    // Register another user
    const userRes = await request(app).post("/api/auth/register").send({
      username: "memberuser",
      email: "memberuser@example.com",
      password: "password123",
    });
    const token2 = userRes.body.token;
    const decoded = jwt.verify(token2, process.env.JWT_SECRET);
    const memberId = decoded.id;

    const res = await request(app)
      .post(`/api/groups/${groupId}/members`)
      .set("x-auth-token", token)
      .send({ userId: memberId });
    expect(res.statusCode).toBe(200);
    expect(res.body.members).toContain(memberId);
  });
});
