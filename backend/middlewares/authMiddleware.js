const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to protect routes
const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (token && token.startsWith("Bearer")) {
      token = token.split(" ")[1]; 

      // Verify token
      const decoded = jwt.verify(token, "revia");

      // Get user from decoded token, exclude password field
      req.user = await User.findById(decoded.id).select("-password");

      next(); // Move to the next middleware or route
    } else {
      res.status(401).json({ message: "Not authorized, no token" });
    }
  } catch (err) {
    res.status(401).json({ message: "Token failed or expired" });
  }
};

module.exports = { protect }
