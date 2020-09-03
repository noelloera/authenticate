const express = require("express");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const router = express.Router();

const User = require("../database/models/User.js");

//Signup route for the server
router.post(
  "/signup",
  [
    check("username", "please enter valid username").not().isEmpty(),
    check("email", "please enter validd email").isEmail(),
    check("password", "please enter valid password").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({
        errors: errors.array(),
      });
    }
    //saves copy directly to the same name
    const { username, email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).send({ message: "user already exists" });
      }
      user = new User({
        username,
        email,
        password,
      });
      //hashing the password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        "randomString",
        {
          expiresIn: 10000,
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({ token });
        }
      );
    } catch (error) {
      console.log(error.message);
      res.status(500).send({ message: "error in saving" });
    }
  }
);

//Log in route for the server
router.post(
  "/login",
  [
    check("email", "please enter a valid email").isEmail(),
    check("password", "please enter a valid password").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).send({ message: "user does not exist" });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(400).send({ message: "incorrect password" });
      }
      const payload = {
        user: { id: user.id },
      };
      jwt.sign(payload, "randomString", { expiresIn: 3600 }, (error, token) => {
        if (error) throw error;
        res.status(200).send({ token });
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "server error" });
      throw error;
    }
  }
);

router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.send(user);
  } catch (error) {
    console.log(error);
    res.send({ message: "error in fetching user" });
  }
});

module.exports = router;
