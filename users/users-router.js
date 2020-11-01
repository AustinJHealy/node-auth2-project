const express = require("express");
const bcryptjs = require("bcryptjs");
const Users = require("./users-model");
const restrict = require("./users-middleware");
const jwt = require("jsonwebtoken");
const router = express.Router();

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };

  return jwt.sign(payload, process.env.JWT_SECRET);
}
router.post("/register", (req, res) => {
  let user = req.body;

  const hashed = bcryptjs.hashSync(user.password, 14);

  user.password = hashed;

  Users.add(user)
    .then((newUser) => {
      res.status(201).json(newUser);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.post("/login", (req, res) => {
  let { username, password } = req.body;
  Users.findBy({ username })
    .then((user) => {
      if (user && bcryptjs.compareSync(password, user.password)) {
        const token = generateToken(user);

        res.status(200).json({
          message: `Welcome ${user.username}`,
          token,
        });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.get("/users", restrict, (req, res, next) => {
  Users.find()
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      res.status(500).json({ message: "Unable to get users" });
    });
});

module.exports = router;
