const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

// Route pour mettre à jour les informations de l'utilisateur
router.put("/user", authMiddleware, userController.updateUser);

// Route pour supprimer l'utilisateur
router.delete("/user/:id", authMiddleware, userController.deleteUser);

// Route pour récupérer les informations de l'utilisateur
router.get("/user", authMiddleware, userController.getUserInfo);

module.exports = router;
