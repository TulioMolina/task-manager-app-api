const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const { userOne, userOneId, setupDatabase } = require("./fixtures/db");

beforeEach(setupDatabase);

test("Should signup a new user", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: "Tulio",
      email: "t1@example.com",
      password: "1234567",
    })
    .expect(201);

  // Assert that the db was changed correctly
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  // Assert the response body
  expect(response.body).toMatchObject({
    user: {
      name: user.name,
      email: user.email,
    },
    token: user.tokens[0].token,
  });
  expect(user.password).not.toBe("1234567");
});

test("Should login existing user", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({ email: userOne.email, password: userOne.password })
    .expect(200);

  // Assert that token is saved

  const user = await User.findById(response.body.user._id);
  expect(user.tokens[1].token).toBe(response.body.token);
});

test("Should not login nonexistent user", async () => {
  await request(app)
    .post("/users/login")
    .send({ email: "fail@example.com", password: "1234567" })
    .expect(400);
});

test("Should get user profile", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not get profile for unauthenticated user", async () => {
  await request(app).get("/users/me").send().expect(401);
});

test("Should delete account for user", async () => {
  const response = await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById(response.body._id);
  expect(user).toBeNull();
});

test("Should not delete unauthenticated user", async () => {
  await request(app).delete("/users/me").send().expect(401);
});

test("Should upload avatar image", async () => {
  await request(app)
    .post("/users/me/avatar")
    .attach("avatar", "tests/fixtures/profile-pic.jpg")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .expect(200);
  const user = await User.findById(userOneId);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

test("Should update user fields", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({ name: "Carl" })
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.name).toEqual("Carl");
});

test("Should not update invalid user field", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({ country: "Venezuela" })
    .expect(400);
});
