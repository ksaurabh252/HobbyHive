const request = require("supertest");
const app = require("../app");

let token;

beforeAll(async () => {
  const res = await request(app).post("/api/auth/register").send({
    username: "hobbyuser",
    email: "hobbyuser@example.com",
    password: "password123",
  });
  token = res.body.token;
});

describe("Hobby API", () => {
  let hobbyId;

  it("should create a new hobby", async () => {
    const res = await request(app)
      .post("/api/hobbies")
      .set("x-auth-token", token)
      .send({
        name: "Painting",
        description: "All about painting",
        skillLevel: "Beginner",
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("Painting");
    hobbyId = res.body._id;
  });

  it("should get all hobbies", async () => {
    const res = await request(app).get("/api/hobbies");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should update a hobby", async () => {
    const res = await request(app)
      .put(`/api/hobbies/${hobbyId}`)
      .set("x-auth-token", token)
      .send({ description: "Updated description" });
    expect(res.statusCode).toBe(200);
    expect(res.body.description).toBe("Updated description");
  });

  it("should delete a hobby", async () => {
    const res = await request(app)
      .delete(`/api/hobbies/${hobbyId}`)
      .set("x-auth-token", token);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Hobby deleted successfully");
  });
});
