const bcrypt = require("bcrypt"); //Bibliotheque utilisée pour le hachage sécurisée des mots de passe
const jwt = require("jsonwebtoken"); //importation du module jsonwebtoken
const User = require("../models/User");
// const PasswordSchema = require("../models/password");
const validator = require("validator"); //module validator

const isEmailValid = require("../utils/emailValid");
const {
  isPasswordValid,
  validationMessages,
} = require("../utils/passwordValid");

exports.signup = async (req, res, next) => {
  try {
    // Vérification de la validité de l'email

    if (!isEmailValid(req.body.email)) {
      return res.status(400).json({
        message: `adresse email non valide!`,
      });
    }

    // Vérification de la validité du mot de passe

    if (!isPasswordValid(req.body.password)) {
      return res.status(400).json({
        message: validationMessages(req.body.password),
      });
    }

    // Pour Hasher le mot de passe avec bcrypt
    const hash = await bcrypt.hash(req.body.password, 10);

    // Créer un nouvel utilisateur avec l'e-mail et le mot de passe hashé
    const user = new User({
      email: req.body.email,
      password: hash,
    });

    user
      .save() //enregistre le nouvel utilisateur dans labase de donnée=>Méthode Save
      .then(() =>
        res.status(201).json({ message: "Utilisateur créé avec succès !" })
      )
      .catch((error) => res.status(400).json({ message: error.message }));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res, next) => {
  try {
    //Pour rechercher un utilisateur dans la base de données en fonction de l'e-mail fourni dans la requête.
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(401).json({ message: "Utilisateur non trouvé !" });
    }

    const validPassword = await bcrypt.compare(
      req.body.password, //Mot de passe fourni dans la requête
      user.password //Mot de passe haché stocké dans la Base de données
    );

    if (!validPassword) {
      return res.status(401).json({ message: "Mot de passe incorrecte" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRETTOKEN, {
      expiresIn: "24h",
    });

    res.status(200).json({
      userId: user._id,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
