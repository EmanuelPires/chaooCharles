const Joi = require("joi");
const bcrypt = require("bcrypt");
const express = require("express");
const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.post("/", async (req, res) => {
  console.log("starting the sign in");
  const schema = Joi.object({
    email: Joi.string().min(3).max(200).email().required(),
    password: Joi.string().min(6).max(200).required(),
  });
  const { error } = schema.validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  try {
    let user = await User.findOne({ email: req.body.email });

    if (!user)
      return res
        .status(400)
        .send("User doesnt exist AKA you're email is wrong!");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) return res.status(400).send("Invalid user or password");
    const secretKey = process.env.SECRET_KEY;
    const token = jwt.sign(
      { _id: user._id, name: user.name, email: user.email },
      secretKey
    );

    res.send(token);
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

module.exports = router;
