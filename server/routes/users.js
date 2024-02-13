const { User } = require("../models/users");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.get(`/`, async (req, res) => {
  const userList = await User.find().select("-passwordHash");

  if (!userList) {
    res.status(500).json({ success: false });
  }
  res.send(userList);
});

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select("-passwordHash");

  if (!user) {
    res
      .status(500)
      .json({ message: "The user with the given ID was not found." });
  }
  res.status(200).send(user);
});

router.post("/", async (req, res) => {
  let user = new User({
    name: req.body.name,
    username: req.body.username,
    phoneNumber: req.body.phoneNumber,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    confirmPasswordHash: bcrypt.hashSync(req.body.confirmPassword, 10),
    isAdmin: req.body.isAdmin,
  });
  user = await user.save();

  if (!user) return res.status(400).send("the user cannot be created!");

  res.send(user);
});

router.put("/:id", async (req, res) => {
  const userExist = await User.findById(req.params.id);
  let newPassword;
  if (req.body.password) {
    newPassword = bcrypt.hashSync(req.body.password, 10);
  } else {
    newPassword = userExist.passwordHash;
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      username: req.body.username,
      passwordHash: newPassword,
      phoneNumber: req.body.phoneNumber,
      confirmPasswordHash: req.body.phone,
      isAdmin: req.body.isAdmin,
    },
    { new: true }
  );

  if (!user) return res.status(400).send("the user cannot be created!");

  res.send(user);
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const secret = process.env.secret;
  if (!user) {
    return res.status(400).send("The user not found");
  }

  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.isAdmin,
      },
      secret,
      { expiresIn: "1d" }
    );

    res.status(200).send({ user: user.email, token: token });
  } else {
    res.status(400).send("password is wrong!");
  }
});

// register users
router.post("/register", async (req, res) => {
  let user = new User({
    name: req.body.name,
    username: req.body.username,
    phoneNumber: req.body.phoneNumber,
    confirmPasswordHash: req.body.confirmPassword,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    isAdmin: req.body.isAdmin,
  });
  user = await user.save();

  if (!user) return res.status(400).send("the user cannot be created!");

  res.send(user);
});

router.delete("/:id", (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then((user) => {
      if (user) {
        return res
          .status(200)
          .json({ success: true, message: "the user is deleted!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "user not found!" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

router.get(`/get/count`, async (req, res) => {
  const userCount = await User.countDocuments((count) => count);

  if (!userCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    userCount: userCount,
  });
});

module.exports = router;

// const express = require("express");

// const User = require("../models/user");
// const router = express.Router();

// router.post("/", async (req, res) => {
//   const { name, password, confirmPassword, username } = req.body;

//   try {
//     const userAdded = await User.create({
//       name: name,
//       password: password,
//       confirmPassword: confirmPassword,
//       username: username,
//     });
//     res.status(400).json(userAdded);
//   } catch (error) {
//     console.log(error);
//     res.status(201).json({ error: error.message });
//   }
// });

// router.get("/", async (req, res) => {
//   try {
//     const showAll = await User.find();

//     res.status(200).json(showAll);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: error.message });
//   }
// });

// router.delete("/:id", async (req, res) => {
//   const { id } = req.params;

//   try {
//     const singleUser = await User.findByIdAndDelete({ _id: id });
//     res.status(200).json(singleUser);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: error.message });
//   }
// });

// router.patch("/:id", async (req, res) => {
//   const { id } = req.params;
//   const { name, username, password, confirmPassword } = req.body;
//   try {
//     const updateUser = await User.findByIdAndUpdate(id, req.body, {
//       new: true,
//     });
//     res.status(200).json(updateUser);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;
