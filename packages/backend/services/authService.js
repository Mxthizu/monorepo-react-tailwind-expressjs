const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const config = require("../config/config");

exports.register = async ({ username, email, password }) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
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
