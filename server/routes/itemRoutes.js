const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");
const authMiddleware = require("../middleware/authentication");

// Authentication middleware for item routes
router.use(authMiddleware);

// Routes
router.get("/:shopId/items", itemController.getAllItems);
router.get("/:shopId/items/:itemId", itemController.getItemById);
router.post("/:shopId/items", itemController.createItem);
router.put("/:shopId/items/:itemId", itemController.updateItem);
router.delete("/:shopId/items/:itemId", itemController.deleteItem);

module.exports = router;
