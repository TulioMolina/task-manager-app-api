const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const app = express();
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.get("/", (req, res) => {
  res.send({
    message:
      "Welcome to the task management REST API, for usage details and availbale endpoints please refer to the API reference on https://github.com/TulioMolina/task-management-api#api-reference",
  });
});

module.exports = app;
