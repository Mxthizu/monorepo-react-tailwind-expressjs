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
router.post("/request-password-reset", authController.requestPasswordReset);
router.post("/reset-password/:token", authController.resetPassword);
router.get("/confirm-email/:token", authController.confirmEmail);
router.post("/resend-confirmation", authController.resendConfirmationEmail);

module.exports = router;
