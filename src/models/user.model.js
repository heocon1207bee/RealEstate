const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const countryEnum = ["vietnam", "laos", "cambodia"];

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/ },
  password: { type: String, required: true, minlength: 6, maxlength: 50 },
  name: { type: String, required: true, maxlength: 250 },
  phone: {
    country: { type: String, enum: countryEnum },
    number: { type: Number },
  },
  admin: { type: Boolean, default: false },
  address: { type: String },
  avatar: { type: String },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("User", userSchema);
