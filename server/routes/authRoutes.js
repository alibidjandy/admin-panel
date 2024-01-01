const express = require("express");
const router = express.Router();
const authenticationController = require("../controllers/userController");

// Login route
router.post("/login", authenticationController.login);

module.exports = router;
