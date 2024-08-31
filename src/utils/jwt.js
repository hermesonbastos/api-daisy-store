const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET || "admin";

const generateToken = (payload, expiresIn = "24h") => {
  return jwt.sign(payload, secretKey, { expiresIn });
}

const verifyToken = (token) => {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    return null;
  }
}

module.exports = {
  generateToken,
  verifyToken
}