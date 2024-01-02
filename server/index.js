const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors");
const functions = require("firebase-functions");

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
const shopRoutes = require("./routes/shopRoutes");
const itemRoutes = require("./routes/itemRoutes");
const authRoutes = require("./routes/authRoutes");

const errorHandler = require("./middleware/errorHandler");

app.use("/shops", shopRoutes);
app.use("/items", itemRoutes);
app.use("/auth", authRoutes);

app.use(errorHandler); // Error handling middleware should be added after defining routes

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

exports.api = functions.https.onRequest(app);
