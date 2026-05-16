const jwt = require("jsonwebtoken");

const users = require("../models/AuthModel");

const protect = (req, res, next) => {
  let token;

  // CHECK TOKEN
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // VERIFY TOKEN
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      // FIND USER FROM MODEL
      const user = users.find(
        (u) => u.role === decoded.role
      );

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }

      req.user = user;

      next();

    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Token failed",
      });
    }
  }

  // NO TOKEN
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }
};

module.exports = {
  protect,
};