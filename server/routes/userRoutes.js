const express = require("express");

const User = require("../models/users");
const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, username, password } = req.body;
  User.findOne({ username: username }, (err, user) => {
    if (user) {
      res.send({ message: "User is already registered" });
    } else {
      const user = new User({
        name,
        username,
        password,
      });

      user.save((err) => {
        if (err) {
          res.send(err);
        } else {
          res.send({ message: "Succesfully registered" });
        }
      });
    }
  });

  // try {
  //   const userAdded = await User.create({
  //     name: name,
  //     username: username,
  //     password: password,
  //     confirmPassword: confirmPassword,
  //   });
  //   res.status(400).json(userAdded);
  // } catch (error) {
  //   console.log(error);
  //   res.status(201).json({ error: error.message });
  // }
});

router.get("/", async (req, res) => {
  try {
    const showAll = await User.find();

    res.status(200).json(showAll);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const singleUser = await User.findByIdAndDelete({ _id: id });
    res.status(200).json(singleUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    name: name,
    username: username,
    password: password,
    confirmPassword: confirmPassword,
  } = req.body;
  try {
    const updateUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updateUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
