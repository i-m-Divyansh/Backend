require("dotenv").config();
const { validationResult } = require("express-validator");
const Jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");

//? Model
const User = require("../models/user");

//? Helpers
const { errorMessage, successMessage } = require("../helpers/helper");

exports.signup = async (req, res) => {
  try {
    //? Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log({ errors: errors.array() });
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    let { firstName, lastName, email, password } = req.body;

    //? Checking is user is already present or not
    let isUserAlreadyExists = await User.findOne({ email });

    //? If user is already exists
    if (isUserAlreadyExists) {
      successMessage(res, 400, "User Already Exist with this Email!");
      return;
    }

    //? Making hash_password with incoming password
    let hashed_password = await bcryptjs.hash(password, 10);

    //? Creating user
    let user = await User.create({
      firstName,
      lastName,
      email,
      hashed_password,
    });

    //? Creating token
    let token = Jwt.sign({ _id: user._id }, process.env.SECRET);

    console.log({ user });

    //? Destructing _id from user
    let { _id } = user;

    successMessage(res, 201, "Signed Up Successfully!", {
      token,
      user: { _id, firstName, lastName },
    });
  } catch (err) {
    console.log({ err });
    errorMessage(res, 400, err);
  }
};

exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;

    //? Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log({ errors: errors.array() });
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    let user = await User.findOne({ email });

    //? Checking if user exist with email
    if (!user) {
      successMessage(res, 400, "User Does not Exist!");
      return;
    }

    if (await bcryptjs.compare(password, user.hashed_password)) {
      //? Creating token
      let token = Jwt.sign({ _id: user._id }, process.env.SECRET);
      let { _id, firstName, lastName } = user;
      successMessage(res, 200, "Logged In Successfully!", {
        token,
        user: { _id, firstName, lastName },
      });
      return;
    }

    successMessage(res, 400, "Email or Password is Incorrect!");
  } catch (err) {
    console.log({ err });
    errorMessage(res, 400, err);
  }
};
