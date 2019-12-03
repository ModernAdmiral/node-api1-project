// implement your API here
const express = require("express");
const db = require("./data/db.js");
const server = express();

server.use(express.json()); // This is needed to parse JSON from the body

server.post("/api/users", (req, res) => {
  // get data the client sends in
  const userData = req.body;

  if (userData.bio === "" || userData.name === "") {
    res
      .status(404)
      .json({ errorMessage: "Please provide name and bio for the user." });
  }

  db.insert(userData)
    // .then(user => {})
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      console.log("error on POST /api/users", err);
      res.status(500).json({
        error: "There was an error while saving the user to the database"
      });
    });
});

server.get("/api/users", (req, res) => {
  db.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      console.log("error on GET /users", err);
      res
        .status(500)
        .json({ error: "The users information could not be retrieved." });
    });
});

server.get("/api/users/:id", (req, res) => {
  const id = req.params.id;
  db.findById(id)
    .then(user => {
      if (!user) {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      } else {
        res.status(200).json(user);
      }
    })
    .catch(err => {
      console.log(`error on GET /user/${id}`, err);
      res
        .status(500)
        .json({ error: "The user information could not be retrieved." });
    });
});

server.delete("/api/users/:id", (req, res) => {
  const id = req.params.id;

  db.remove(id)
    .then(removed => {
      if (!removed) {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      } else {
        res.status(200).json({ message: "The user was removed successfully" });
      }
    })
    .catch(err => {
      console.log("error on DELETE /api/user/:id", err);
      res.status(500).json({ error: "The user could not be removed" });
    });
});

server.put("/api/users/:id", (req, res) => {
  const id = req.params.id;
  const userData = req.body;

  if (userData.bio === "" || userData.name === "") {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  } else {
    db.update(id, userData)
      .then(user => {
        if (user) {
          res.status(200).json({ message: "The user was updated", userData });
        } else {
          res.status(404).json({
            message: "The user with the specified ID does not exist."
          });
        }
      })
      .catch(err => {
        console.log("error on PUT /api/users/:id", err);
        res
          .status(500)
          .json({ error: "The user information could not be modified" });
      });
  }
});
const port = 5000;
server.listen(port, () => console.log(`/n API is running on port ${port} /n`));
