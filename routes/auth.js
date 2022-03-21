const router = require("express").Router();
const { check } = require("express-validator");

//? Controllers
const { signup, login } = require("../controllers/authController");

router.post(
  "/signup",
  [
    check("firstName").not().isEmpty().withMessage("firstName is Required!"),
    check("lastName").not().isEmpty().withMessage("lastName is Required!"),
    check("email")
      .not()
      .isEmpty()
      .withMessage(" Email is Required!")
      .isEmail()
      .withMessage("Valid Email is Required!"),
    check("password").not().isEmpty().withMessage("Password is Required!"),
  ],
  signup
);

router.post(
  "/login",
  [
    check("email")
      .not()
      .isEmpty()
      .withMessage("Email is Required!")
      .isEmail()
      .withMessage("Valid Email is Required!"),
    check("password").not().isEmpty().withMessage("Password is Required!"),
  ],
  login
);

module.exports = router;
