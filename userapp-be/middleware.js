require('dotenv').config();
const jwt = require("jsonwebtoken");

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({
      success: false,
      message: "No authorization data provided!",
    });
  }

  const token = authHeader.split(" ")[1];

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized",
    });
  }

  req.userId = decoded.user_id;
  next();
}

module.exports = authMiddleware;