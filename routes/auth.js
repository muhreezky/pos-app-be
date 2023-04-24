const routes = require("express").Router();
const { body } = require("express-validator");
const { authController } = require("../controllers");

const { verifyToken } = require("../middlewares/auth");

routes.post(
  "/login",
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  authController.login
);

routes.post(
  "/register",
  body("username").matches(/[a-zA-Z0-9\_]{4,}/g),
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  body("store_name").isString(),
  body("phone_num").isMobilePhone(),
  authController.register
);

routes.post(
  "/products",
  body("product_name")
)

routes.get("/user", authController.checkUser);

module.exports = routes;
