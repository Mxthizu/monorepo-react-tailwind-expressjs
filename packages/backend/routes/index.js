const express = require("express");
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");

const router = express.Router();

// Routes d'authentification
router.use("/auth", authRoutes);

// Routes utilisateur
router.use("/", userRoutes);

module.exports = router;
