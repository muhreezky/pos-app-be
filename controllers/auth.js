const { User } = require("../models");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authController = {
  register: async function (req, res) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ message: result.array()[0].msg });
    }

    const { username, email, password, store_name, phone_num } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    try {
      await User.create({
        username,
        email,
        password: hashed,
        phone_num,
        store_name,
      });

      return res.status(201).json({
        message: "New Account created",
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },
  login: async function (req, res) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ message: result.array()[0].msg });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({
        where: {
          email,
        },
      });

      if (!user) {
        return res.status(404).json({ message: "Accound not found" });
      }

      const checkPass = bcrypt.compare(password, user.password);

      if (!checkPass) {
        return res.status(422).json({ message: "Password incorrect" });
      }

      const payload = { user_id: user.user_id, username: user.username };
      const token = await jwt.sign(payload, "pos_by_grup3", {
        expiresIn: "7d",
      });

      return res.status(200).json({
        message: "Login success",
        token,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  checkUser: async function (req, res) {
    try {
      const { authorization } = req.headers;
      console.log(authorization);
      const token = authorization.split(" ")[1];
      const result = await jwt.verify(token, "pos_by_grup3");

      const findUser = await User.findOne({
        where: {
          user_id: result.user_id,
        },
      });

      if (!findUser || !result) {
        return res.status(404).json({ message: "Account not found" });
      }

      console.log(findUser);

      return res.status(200).json({ user: findUser });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = authController;
