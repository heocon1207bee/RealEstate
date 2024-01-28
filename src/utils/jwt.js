const jwt = require("jsonwebtoken");

const createToken = (user) => {
  const payload = {
    email: user.email,
    id: user.id,
  };

  const options = {
    expiresIn: "1d",
  };

  return jwt.sign(payload, process.env.JWT_SECRET, options);
};

const verifyToken = (token) => {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return payload;
  } catch (error) {
    return null;
  }
};

module.exports = { createToken, verifyToken };
