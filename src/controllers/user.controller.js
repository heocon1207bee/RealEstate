const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const { response } = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secretKey = process.env.SECRET_KEY;

module.exports = {
  signUp: async (req, res) => {
    try {
      const { email, password, name, phone } = req.body;

      const isPasswordValid = password.match(/^.{6,100}$/);
      if (!isPasswordValid) {
        res.status(400).send("Password must be between 6 and 100 characters");
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = new User({
        email: email,
        password: hashedPassword,
        name: name,
        phone: phone,
      });

      await user.save();

      res.status(201).send("User created");
    } catch (err) {
      console.error(err);
      if (err.code === 11000) {
        return res.status(409).send("User already exists");
      }
      res.status(400).send("Error when creating user");
    }
  },
  logIn: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).send("User is not exist");
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).send("Wrong password");
      }

      const token = jwt.sign({ userId: user._id, email: user.email }, secretKey, { expiresIn: "7d" });

      res.status(200).json({ message: "Loged in", Authorization: `Bearer ${token}` });
    } catch (err) {
      console.log(err);
      return res.status(400).send(err.message);
    }
  },
  getUserByEmail: async (req, res) => {
    const user = await User.findOne({ email: req.query.email });

    if (user) {
      return res.status(200).send(({ email, name, phoneNumber, admin, address, avatar } = user));
    } else {
      return res.status(404).send("User not found");
    }
  },
  getUserInfo: async (req, res) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, secretKey);
      if (!decodedToken || !decodedToken.userId) {
        return res.status(401).send("Invalid token");
      }
      const user = await User.findById(decodedToken.userId);
      if (!user) {
        return res.status(404).send("User not found");
      }
      const { email, name, phone, address, avatar } = user;
      return res.json({ email, name, phone, address, avatar });
    } catch (err) {
      return res.status(500).send(err.message);
    }
  },
  updateUserInfo: async (req, res) => {
    try {
      const { name, phone, address, avatar } = req.body;

      if (req.body.email) {
        return res.status(403).send("Can not update email");
      }
      if (req.body.password) {
        return res.status(403).send("Can not update password via this method");
      }
      if (req.body.admin) {
        return res.status(403).send("Cannot change admin permissions");
      }

      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, secretKey);
      if (!decodedToken || !decodedToken.userId) {
        return res.status(401).send("Invalid token");
      }

      const updatedUser = await User.findOneAndUpdate(
        { _id: decodedToken.userId },
        {
          $set: {
            name: name || user.name,
            address: address || user.address,
            avatar: avatar || user.avatar,
            phone: {
              country: phone.country || user.phone.country,
              number: phone.number || user.phone.number,
            },
          },
        },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).send("User not found");
      }

      return res.status(200).json({ message: "User informations updated", user: updatedUser });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error", error: err });
    }
  },
};
