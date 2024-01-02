const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const jwtSecretKey = "YourSecretKeyShouldBeLongAndRandom"; // Replace with your actual secret key

// Authentication middleware
router.use((req, res, next) => {
  // Check authorization header for JWT
  const token = req.headers.authorization.substring(
    8,
    req.headers.authorization.length - 1
  );

  if (token) {
    // Verify JWT token
    jwt.verify(token, jwtSecretKey, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Unauthorized" });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(401).json({ message: "No token provided" });
  }
});

module.exports = router;
