const bcrypt = require("bcrypt");
const User = require("../models/User");
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
