const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

app.get("/todos", (req, res) => {
  fs.readFile("todos.json", "utf8", (err, data) => {
    if (err) throw err;

    const todos = JSON.parse(data);
    res.json(todos);
  });
});

app.get("/todos/:id", (req, res) => {
  fs.readFile("todos.json", "utf8", (err, data) => {
    if (err) throw err;

    const todos = JSON.parse(data);
    const id = parseInt(req.params.id);
    for (const todo of todos) {
      if (id === todo["id"]) {
        res.json(todo);
      }
    }
    res.status(404).send();
  });
});

app.post("/todos", (req, res) => {
  fs.readFile("todos.json", "utf8", (err, data) => {
    if (err) throw err;

    const todos = JSON.parse(data);
    const todo = req.body;
    const id = Math.floor(Math.random() * 100000) + 1;
    todo["id"] = id;
    todos.push(todo);

    fs.writeFile("todos.json", JSON.stringify(todos), (data) => {
      res.status(201).send({ id: id });
    });
  });
});

app.put("/todos/:id", (req, res) => {
  fs.readFile("todos.json", "utf8", (err, data) => {
    if (err) throw err;

    const todos = JSON.parse(data);
    const id = parseInt(req.params.id);
    let todoIndex = -1;
    for (const index in todos) {
      if (id === todos[index]["id"]) {
        todoIndex = index;
      }
    }
    if (todoIndex === -1) {
      res.sendStatus(404);
    } else {
      todos[todoIndex]["title"] = req.body.title;
      todos[todoIndex]["description"] = req.body.description;

      fs.writeFile("todos.json", JSON.stringify(todos), (data) => {
        res.send();
      });
    }
  });
});

app.delete("/todos/:id", (req, res) => {
  fs.readFile("todos.json", "utf8", (err, data) => {
    if (err) throw err;

    const todos = JSON.parse(data);
    const id = parseInt(req.params.id);
    let deleteIndex = -1;
    for (const todoIndex in todos) {
      if (id === todos[todoIndex]["id"]) {
        deleteIndex = todoIndex;
      }
    }
    if (deleteIndex === -1) {
      res.sendStatus(404);
    } else {
      todos.splice(deleteIndex, 1);

      fs.writeFile("todos.json", JSON.stringify(todos), (data) => {
        res.send();
      });
    }
  });
});

app.use((req, res, next) => {
  res.status(404).send();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
