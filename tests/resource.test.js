const { request, getAuthToken } = require("./utils");

describe("Resource API", () => {
  let token;
  let resourceId;

  beforeAll(async () => {
    token = await getAuthToken();
  });

  test("Share resource", async () => {
    const res = await request
      .post("/api/resources")
      .set("x-auth-token", token)
      .send({
        title: "Photography Tips",
        description: "10 tips for beginners",
        url: "https://example.com/photography-tips",
        type: "Article",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    resourceId = res.body._id;
  });

  test("Rate resource", async () => {
    const res = await request
      .post(`/api/resources/${resourceId}/rate`)
      .set("x-auth-token", token)
      .send({ rating: 5 });

    expect(res.statusCode).toBe(200);
    expect(res.body.ratings.length).toBeGreaterThan(0);
  });
});
