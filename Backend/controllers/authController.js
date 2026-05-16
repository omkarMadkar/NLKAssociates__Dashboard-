const users = require("../models/Users");

const generateToken = require("../utils/generateToken");


// LOGIN CONTROLLER
const loginUser = async (req, res) => {
  const { role, password } = req.body;

  // FIND USER
  const user = users.find(
    (u) =>
      u.role === role &&
      u.password === password
  );

  // SUCCESS
  if (user) {
    return res.status(200).json({
      success: true,

      message: "Login successful",

      user: {
        role: user.role,
      },

      token: generateToken(user.role),
    });
  }

  // FAILED
  return res.status(401).json({
    success: false,
    message: "Invalid role or password",
  });
};

module.exports = {
  loginUser,
};