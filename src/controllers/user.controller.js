const User = require("../models/user.model");
const bcrypt = require("bcrypt");
require("dotenv").config();
const secretKey = process.env.SECRET_KEY;

module.exports = {
  signUp: async (req, res) => {
    try {
      const { email, password, name, phone } = req.body;

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = new User({
        email: email,
        password: hashedPassword,
        name: name,
        phone: phone,
      });

      await user.save();

      res.status(201).send("User created!");
    } catch (err) {
      console.error(err);
      if (err.code === 11000) {
        res.status(409).send("User already exists!");
      }
      res.status(400).send("Error when creating user!");
    }
  },
  logIn: async (req, res) => {
    const { email, password } = req.body;

    const user = User.findOne({ email: email });
    if (!user) {
      return res.status(401).send("User is not exist");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send("Wrong password");
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, secretKey, { expiresIn: "7d" });

    res.status(200).json({ message: "Loged in", token });
  },
  getUserByEmail: async (req, res) => {
    const user = await User.findOne({ email: req.query.email });

    if (user) {
      res.status(200).send(({ email, name, phoneNumber, admin, address, avatar } = user));
    } else {
      return res.status(404).send("User not found!");
    }
  },
};
