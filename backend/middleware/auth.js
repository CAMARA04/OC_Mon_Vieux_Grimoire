// ************Middleware d'authentification pour verifier la validité du token *********

const jwt = require("jsonwebtoken"); //importation du module jsonwebtoken

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; //extraction du token JWT de l'en tete
    const decodedToken = jwt.verify(token, process.env.SECRETTOKEN); //verification da la validité et decoder le token
    const userId = decodedToken.userId; //extraction de l'identifiant utilisateur contenu dans le token
    req.auth = {
      userId: userId,
    };
    console.log("Authentication successful");
    next();
  } catch (error) {
    console.error("Authentication failed:", error);
    res.status(401).json({ error });
  }
};
