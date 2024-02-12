//**********Router express pour gérer les requêtes liées aux livres  */

//Importation des modules nécessaires
const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const multer = require("../middleware/multer-config");

const booksCtrl = require("../controllers/books"); //importe le contrôleur de books qui contient les fonctions de gestion des requêtes relatives aux livres

// Routes pour les opérations CRUD (Create, Read, Update, Delete) sur les livres
router.get("/", booksCtrl.getAllBooks); //Récupère tous les livres
router.post("/", auth, multer, booksCtrl.createBook); //Crée un nouveau livre
router.put("/:id", auth, multer, booksCtrl.modifyBook); //Modifie un livre existant
router.get("/bestrating", booksCtrl.getBestRatedBooks); //Récupère les livres avec la meilleure note
router.post("/:id/rating", auth, booksCtrl.rateBook); //Enregistre une évaluation pour un livre spécifique
router.delete("/:id", auth, booksCtrl.deleteBook); //Supprime un livre
router.get("/:id", booksCtrl.getOneBook); //Récupère un livre spécifique

module.exports = router; //Exporte le routeur crée pour etre utilisé par d'autres parties dans l'app
