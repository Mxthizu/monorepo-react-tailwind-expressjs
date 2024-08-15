const bcrypt = require("bcrypt");
const config = require("../config/config");
const User = require("../models/User");
const { Op } = require("sequelize");
const authService = require("../services/authService");
const emailService = require("../services/emailService");
const welcomeEmail = require("../emailTemplates/welcomeEmail");
const loginNotification = require("../emailTemplates/loginNotification");

exports.register = async (req, res) => {
  try {
    const user = await authService.register(req.body);

    // Utiliser le modèle d'email de bienvenue
    const { subject, text, html } = welcomeEmail(user.username);
    await emailService.sendEmail(user.email, subject, text, html);

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const token = await authService.login(req.body);

    // Utiliser le modèle de notification de connexion
    const user = await User.findOne({ where: { email: req.body.email } });
    const ipAddress = req.headers["x-forwarded-for"] || req.ip; // Récupère l'adresse IP

    // Utiliser le modèle de notification de connexion
    const { subject, text, html } = loginNotification(user.username, ipAddress);
    await emailService.sendEmail(user.email, subject, text, html);

    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.validatePassword = async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.user.id; // L'ID de l'utilisateur est récupéré depuis le token JWT

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid password" });
    }

    res.status(200).json({ message: "Password is valid" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred during password validation" });
  }
};

exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const resetToken = await authService.generatePasswordResetToken(user);
    const resetLink = `${config.frontendUrl}/reset-password/${resetToken}`;
    await emailService.sendEmail(
      user.email,
      "Password Reset",
      `Hello ${user.username},\n\nPlease reset your password by clicking the link: ${resetLink}\n\nIf you did not request a password reset, please ignore this email.`,
      `<p>Hello <strong>${user.username}</strong>,</p><p>Please reset your password by clicking the link: <a href="${resetLink}">Reset Password</a></p><p>If you did not request a password reset, please ignore this email.</p>`,
    );

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while requesting password reset" });
  }
};

// Fonction pour réinitialiser le mot de passe
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      where: {
        resetPasswordToken: {
          [Op.ne]: null,
        },
        resetPasswordExpires: {
          [Op.gt]: Date.now(),
        },
      },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    const isTokenValid = await bcrypt.compare(token, user.resetPasswordToken);

    if (!isTokenValid) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.log("Error resetting password:", error);
    res
      .status(500)
      .json({ error: "An error occurred while resetting the password" });
  }
};
