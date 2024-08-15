const express = require("express");
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post(
  "/validate-password",
  authMiddleware,
  authController.validatePassword,
);

// Route pour demander la réinitialisation du mot de passe
router.post("/request-password-reset", authController.requestPasswordReset);

// Route pour réinitialiser le mot de passe avec le token
router.post("/reset-password/:token", authController.resetPassword);

module.exports = router;
