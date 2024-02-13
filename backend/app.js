//**************Point d'entrée principal de l'application*****************

//Importation des modules nécessaires
const express = require("express"); //Framework pour Node.js
const app = express(); //Initialisation de l'application Express
const bodyParser = require("body-parser"); //Middleware pour analyser les corps de requête HTTP
const mongoose = require("mongoose"); //Bibliotheque pour MongoDB
require("dotenv").config(); //Permet de charger les variables d'environnement à partir d'un fichier .env

const booksRoutes = require("./Routes/books");

const userRoutes = require("./Routes/user");
const path = require("path");

//Connexion à la base de données MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(express.json());

//Configuration des CORS (Cross-Origin Resource Sharing)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(bodyParser.json());

//Définition des routes
app.use("/api/books", booksRoutes);
app.use("/api/auth/", userRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

//Exportation de l'application
module.exports = app;
