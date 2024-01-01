const express = require("express");
const router = express.Router();
const shopController = require("../controllers/shopController");
const authMiddleware = require("../middleware/authentication");

// Authentication middleware for all shop routes
router.use(authMiddleware);

// Routes
router.get("/", shopController.getAllShops); // GET all shops
router.get("/:id", shopController.getShopById); // GET shop by ID
router.post("/", shopController.createShop); // Create a new shop
router.put("/:id", shopController.updateShop); // Update a shop by ID
router.delete("/:id", shopController.deleteShop); // Delete a shop by ID

module.exports = router;
