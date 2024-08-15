const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const config = require("../config/config");
const emailService = require("../services/emailService");

exports.register = async ({ username, email, password }) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const emailConfirmationToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      emailConfirmationToken,
    });

    // Envoyer l'email de confirmation
    await this.sendEmailConfirmation(user);

    return user;
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      throw new Error("Username or email already exists");
    } else {
      throw new Error("An error occurred during registration");
    }
  }
};

exports.login = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });

  if (!user) throw new Error("User not found");

  if (!user.isEmailConfirmed) {
    throw new Error("Please confirm your email before logging in");
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) throw new Error("Invalid password");

  const token = jwt.sign({ id: user.id }, config.jwtSecret, {
    expiresIn: "1h",
  });
  return token;
};

exports.generatePasswordResetToken = async (user) => {
  try {
    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = await bcrypt.hash(resetToken, 10);

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 heure
    await user.save();

    return resetToken;
  } catch (error) {
    console.error(
      "Erreur lors de la génération du token de réinitialisation :",
      error,
    );
    throw error; // Pour relancer l'erreur et permettre à l'appelant de la gérer
  }
};

exports.sendEmailConfirmation = async (user) => {
  const emailConfirmationToken = crypto.randomBytes(32).toString("hex");
  user.emailConfirmationToken = emailConfirmationToken;
  await user.save();

  const confirmationLink = `${config.frontendUrl}/confirm-email/${emailConfirmationToken}`;
  await emailService.sendEmail(
    user.email,
    "Confirm your email",
    `Hello ${user.username},\n\nPlease confirm your email by clicking the link: ${confirmationLink}\n\nIf you did not register, please ignore this email.`,
    `<p>Hello <strong>${user.username}</strong>,</p><p>Please confirm your email by clicking the link: <a href="${confirmationLink}">Confirm Email</a></p><p>If you did not register, please ignore this email.</p>`,
  );
};
