const express = require("express");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const router = express.Router();

const User = require("../database/models/User.js");

let refreshTokens = [];
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
        id: user.id ,
      };

      const accessToken = getAccessToken(payload);
      const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);
      //This needs to be stored in a database of refreshtokens
      refreshTokens.push(refreshToken);
      res.status(201).send({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
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
        id: user.id ,
      };
      const accessToken = getAccessToken(payload)
      const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);
      //This needs to be stored in a database of refreshtokens
      refreshTokens.push(refreshToken);
      res.status(200).send({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "server error" });
      throw error;
    }
  }
);

//Signs the access tokens for limited time
function getAccessToken(payload) {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn:900,});
}

router.post("/token", (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) res.status(401).send("no refresh token");
  try {
    if (!refreshTokens.includes(refreshToken))
      res.status(403).send("cannot access");
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET,(error, user) => {
        if (error) return res.status(403);
        const payload = {
          id: user.id ,
        };
        const accessToken = getAccessToken(payload);
        res.status(200).send({ acess_token: accessToken });
      }
    );
  } catch (error) {
    throw error;
  }
});

router.get("/me", auth, async (req, res) => {
  //Esentially you can now just use the auth middleware to auth every call made using that token (GET, PUT, POST)
  try {
    if (req.body.id) {
      const user = await User.findById(req.body.id);
      res.status(200).send(user);
    } else {
      res.status(401).send({ message: "error in fetching user" });
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({ message: "error in fetching user" });
  }
});

module.exports = router;
