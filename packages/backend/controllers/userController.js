const User = require("../models/User");
const bcrypt = require("bcrypt");
const deleteAccountNotification = require("../emailTemplates/deleteAccountNotification");

exports.updateUser = async (req, res) => {
  const { id, firstName, lastName, password } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while updating the user" });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await user.destroy();

    // Utiliser le modèle de notification de suppression de compte
    const { subject, text, html } = deleteAccountNotification(user.username);
    await emailService.sendEmail(user.email, subject, text, html);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while deleting the user" });
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["username", "password", "email"], // Ajoute d'autres champs si nécessaire
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching the user information" });
  }
};
