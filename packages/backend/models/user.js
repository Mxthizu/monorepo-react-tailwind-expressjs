const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Assure l'unicité du username
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Assure l'unicité de l'email
    validate: {
      isEmail: true, // Valide que l'email est dans un format correct
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = User;
