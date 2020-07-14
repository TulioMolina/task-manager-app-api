const express = require("express");
require("./db/mongoose");
const User = require("./models/user");
const Task = require("./models/task");
const validateFields = require("./utils/validateFields");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// chaining promises
// app.post("/user", (req, res) => {
//   const user = new User(req.body);
//   user
//     .save()
//     .then(() => {
//       res.status(201).send(user);
//     })
//     .catch((e) => {
//       console.log(e);
//       res.status(400).send(e);
//     });
// });

// async await using .then().catch()
// app.post("/user", async (req, res) => {
//   const user = new User(req.body);
//   await user
//     .save()
//     .then((user) => {
//       console.log(user);
//     })
//     .catch((e) => {
//       res.status(400).send(e);
//     });
// });

// async await using try/catch block
app.post("/user", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    console.log(user);
    res.status(201).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.post("/task", async (req, res) => {
  const task = new Task(req.body);
  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (e) {
    res.status(500).send();
  }
});

app.get("/user/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (e) {
    res.status(500).send();
  }
});

app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.send(tasks);
  } catch (e) {
    res.status(500).send;
  }
});

app.get("/task/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

app.patch("/user/:id", async (req, res) => {
  if (!validateFields(req, User)) {
    return res.status(400).send({ error: "Invalid update fields" });
  }

  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (e) {
    res.status(400).send();
  }
});

app.patch("/task/:id", async (req, res) => {
  if (!validateFields(req, Task)) {
    return res.status(400).send({ error: "Invalid update fields" });
  }
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (e) {
    res.status(400).send();
  }
});

app.listen(port, () => {
  console.log("App listening on port " + port);
});
