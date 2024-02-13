// **************Implémentation d'un service CRUD (Create, Read, Update, Delete) pour gérer des livres dans l'application*************

//Importation des modules nécessaires
const Book = require("../models/Book");
const fs = require("fs"); //permet d'effectuer des opérations sur les fichiers

exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book); //Récupération des données du livre
  delete bookObject._id; //Suppression de l'id
  delete bookObject.userId; //Suppression de User id

  const book = new Book({
    ...bookObject, //Syntaxe spread pour inclure les proprietés de l'objet bookobject dansl'instance
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });

  book
    .save() // enregistre le livre dans la base de données
    .then(() => {
      //Réponse en fonction du succés ou de l'échec de l'opération
      res.status(201).json({ message: "Livre enregistré !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.modifyBook = (req, res, next) => {
  const bookObject = req.file //requete contient un fichier?
    ? {
        ...JSON.parse(req.body.book), //Parse les données JSON de req.body.book

        // Construction de l'URL de l'image
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : // si aucun fichier n'est présent dans la requête=>syntaxe de spread (...) pour créer une copie de toutes les propriétés de req.body
      { ...req.body };

  delete bookObject._userId;
  Book.findOne({ _id: req.params.id }) // pour trouver le livre à modifier en foncion de son ID
    .then((book) => {
      //Vérification si utilisateur est autorisé à modifier le livre
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        Book.updateOne(
          { _id: req.params.id }, //Garantit que l'id du livre reste inchangé dans la Base de données
          { ...bookObject, _id: req.params.id } //Argument qui specifie les nouvelles valeurs à mettre à jour
        )
          .then(() => res.status(200).json({ message: "Livre modifié!" }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        const filename = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          //Suppression du livre de la base de données en fonction de son ID
          Book.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Livre supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};

exports.getAllBooks = (req, res, next) => {
  Book.find() //Recherche tous les documents dans la collection Book
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

exports.rateBook = (req, res, next) => {
  // Récupération des données de la requête HTTP
  const bookId = req.params.id; //Récupere l'Id du livre à évaluer
  const userId = req.auth.userId; //Récupere l'id de l'utilisateur
  const rating = req.body.rating; //Récupere note attribuée au livre dans le corps de la requête

  // Validation de la note
  if (rating < 0 || rating > 5) {
    return res.status(400).json({ error: "Note invalide !" });
  }

  // Recherche du livre : Objectif est de trouver le livre le bookid spécifié
  Book.findOne({ _id: bookId }) //Trouve le livre dans la bd en fonction de l'id
    .then((book) => {
      if (!book) {
        return res.status(404).json({ error: "Livre non trouvé" });
      } else {
        console.log("livre trouvé!!");
      }

      //Vérification si l'utilisateur a déja noté
      const userRating = book.ratings.find(
        (rating) => rating.userId === userId
      );
      if (userRating) {
        return res
          .status(403)
          .json({ error: "Vous avez déjà noté ce livre !" });
      }

      //Mise à jour des notations: Si l'utilisateur n'a pas encore noté le livre , il ajoute la nouvelle note à l'array 'ratings' du livre
      book.ratings.push({ userId, grade: rating });

      //Calcul du nombre total de notations
      const totalRatings = book.ratings.length;
      // Calcul de la nouvelle moyenne de notation:methode reduce sur l'array book.ratings =>Itére sur chaque élément et accumule la somme des valeurs de notation dans la variable sum puis divise par totalRatings
      const newAverageRating =
        totalRatings > 0
          ? book.ratings.reduce((sum, rating) => sum + rating.grade, 0) /
            totalRatings
          : 0;

      // Mise à jour de la moyenne de notation
      book.averageRating = parseFloat(newAverageRating.toFixed(1)); //Conversion en float et arrondi à une décimale

      // Enregistrement du livre mis à jour
      return book.save();
    })

    //Envoi de la réponse
    .then((updatedBook) => res.status(200).json(updatedBook))
    .catch((error) => res.status(500).json({ erreur: error }));
};

// Pour récuperer les trois livres les mieux notés de la base de données et renvoie une réponse JSON avec ces livres.
exports.getBestRatedBooks = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 }) // Trie par ordre décroissant de la note moyenne
    .limit(3) // Limite le résultat aux 3 premiers livres
    .then((bestRatedBooks) => {
      res.json(bestRatedBooks); // Réponse avec le tableau de livres
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).json({ error: "Erreur serveur." });
    });
};
