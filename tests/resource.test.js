const request = require("supertest");
const app = require("../app");

let token, hobbyId, resourceId;

beforeAll(async () => {
  const res = await request(app).post("/api/auth/register").send({
    username: "resourceuser",
    email: "resourceuser@example.com",
    password: "password123",
  });
  token = res.body.token;

  const hobbyRes = await request(app)
    .post("/api/hobbies")
    .set("x-auth-token", token)
    .send({
      name: "Photography",
      description: "All about photography",
      skillLevel: "Beginner",
    });
  hobbyId = hobbyRes.body._id;
});

describe("Resource API", () => {
  it("should share a resource", async () => {
    const res = await request(app)
      .post("/api/resources")
      .set("x-auth-token", token)
      .send({
        title: "Photography Basics",
        description: "A beginner guide",
        url: "http://example.com/photo",
        type: "Article",
        hobby: hobbyId,
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Photography Basics");
    resourceId = res.body._id;
  });

  it("should rate a resource", async () => {
    const res = await request(app)
      .post(`/api/resources/${resourceId}/rate`)
      .set("x-auth-token", token)
      .send({ rating: 5 });
    expect(res.statusCode).toBe(200);
    expect(res.body.ratings[0].value).toBe(5);
  });
});
