require("dotenv").config(); // Charger les variables d'environnement

const express = require("express");
const cors = require("cors");
const config = require("./config/config"); // Si vous avez d'autres configurations ici
const routes = require("./routes");
const errorHandler = require("./utils/errorHandler");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // Utiliser l'URL du frontend depuis les variables d'environnement
  }),
);

app.use(express.json());
app.use("/api", routes);

// Utiliser le gestionnaire d'erreurs
app.use(errorHandler);

// Utiliser le port défini dans .env ou par défaut 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
