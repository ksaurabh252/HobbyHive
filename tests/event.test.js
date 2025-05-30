const { request, getAuthToken } = require("./utils");

describe("Event API", () => {
  let token;
  let eventId;

  beforeAll(async () => {
    token = await getAuthToken();
  });

  test("Create event", async () => {
    const res = await request
      .post("/api/events")
      .set("x-auth-token", token)
      .send({
        title: "Photography Workshop",
        description: "Learn basics of photography",
        date: new Date(Date.now() + 86400000).toISOString(),
        location: "Online",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    eventId = res.body._id;
  });

  test("RSVP to event", async () => {
    const res = await request
      .post(`/api/events/${eventId}/rsvp`)
      .set("x-auth-token", token);

    expect(res.statusCode).toBe(200);
    expect(res.body.attendees).toContainEqual(expect.anything());
  });
});
