const request = require("supertest");
const app = require("../src/app");
const Task = require("../src/models/task");
const {
  userOne,
  userOneId,
  userTwo,
  userTwoId,
  taskOne,
  taskTwo,
  taskThree,
  setupDatabase,
} = require("./fixtures/db");
const mongoose = require("mongoose");

beforeEach(setupDatabase);

test("Should create a task for userOne", async () => {
  const task1 = {
    description: "finish node.js course",
  };

  const response = await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send(task1)
    .expect(201);

  const task = await Task.findById(response.body._id);
  expect(task.description).toEqual(task1.description);
  expect(task.completed).toEqual(false);
});

test("Should fetch tasks for userOne", async () => {
  const response = await request(app)
    .get("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  expect(response.body.length).toEqual(2);
});

test("Should not delete task of another user", async () => {
  await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404);

  const task = await Task.findById(taskOne._id);
  expect(task).not.toBeNull();
});
