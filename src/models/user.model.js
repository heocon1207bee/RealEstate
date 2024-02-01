const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const countryEnum = ["vietnam", "laos", "cambodia"];
function validatePassword(password) {
  return password.length >= 6 && password.length <= 100;
}

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/ },
  password: { type: String, required: true },
  name: { type: String, required: true, maxlength: 250, default: "" },
  phone: {
    country: { type: String, enum: countryEnum, default: "vietnam" },
    number: { type: Number, required: true, maxlength: 20, default: 0 },
  },
  admin: { type: Boolean, default: false },
  address: { type: String, maxlength: 250, default: "" },
  avatar: { type: String, default: "" },
  birthday: {
    type: Date,
    required: true,
    validator: {
      validate: function (val) {
        return val < new Date();
      },
      message: "Birthday must be less than today",
    },
  },
  baned: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", userSchema);
