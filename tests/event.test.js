const request = require("supertest");
const app = require("../app");

let token, eventId, hobbyId;

beforeAll(async () => {
  const res = await request(app).post("/api/auth/register").send({
    username: "eventuser",
    email: "eventuser@example.com",
    password: "password123",
  });
  token = res.body.token;

  const hobbyRes = await request(app)
    .post("/api/hobbies")
    .set("x-auth-token", token)
    .send({
      name: "Cooking",
      description: "All about cooking",
      skillLevel: "Beginner",
    });
  hobbyId = hobbyRes.body._id;
});

describe("Event API", () => {
  it("should create an event", async () => {
    const res = await request(app)
      .post("/api/events")
      .set("x-auth-token", token)
      .send({
        title: "Cooking Workshop",
        description: "Learn to cook",
        date: new Date(),
        location: "Community Center",
        hobby: hobbyId,
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Cooking Workshop");
    eventId = res.body._id;
  });

  it("should RSVP to an event", async () => {
    const res = await request(app)
      .post(`/api/events/${eventId}/rsvp`)
      .set("x-auth-token", token);
    expect(res.statusCode).toBe(200);
    expect(res.body.attendees).toContainEqual(expect.any(String));
  });
});
