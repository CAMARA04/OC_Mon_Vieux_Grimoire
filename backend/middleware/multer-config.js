//Import des modules necessaires
const multer = require("multer"); //Pour la gestion des fichiers
const sharp = require("sharp"); //Pour manipuler les images
const fs = require("fs"); //Pour réaliser des opérations sur les fichiers

//Associe les types MIM des images à leurs extensions correspondantes
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

//Configuration de multer pour le stockage des fichiers
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images"); //Repertoire de destination des fichiers
  },

  filename: (req, file, callback) => {
    //On définit comment les noms de fichier sont générées
    const name = file.originalname.split(" ").join("_"); //On utilise le nom d'origine, on remplace les espaces par des underscores
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension); //on ajoute un timestamp unique, et on ajoute l'extension en fonction du type MIME.
  },
});

//Création d'un objet multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 4 * 1024 * 1024,
  },
}).single("image");

//Export d'un middleware
module.exports = (req, res, next) => {
  //Pour vérifier s'il y'a une erreur lors de la modification des permissions du dossier "images"
  fs.chmod("images", 0o755, (err) => {
    if (err) {
      console.log(
        "Erreur lors de la modification des permissions pour le dossier `images`"
      );
      next(err);
      return;
    }

    //On appelle le middleware'multer (via upload) afin de gérer le telechargement du fichier
    upload(req, res, async (err) => {
      if (err) {
        console.log("Image supérieure à 4 Mo");
        const error = new Error(
          "L'image dépasse la taille maximale autorisée (4 Mo)."
        );
        error.statusCode = 400;
        next(error); // on passe au middleware suivant
        return;
      }

      try {
        const imagePath = req.file ? req.file.path : null;
        console.log("le chemin est : " + imagePath);
        console.log("Ca marche 1!");
        if (imagePath) {
          console.log("Ca marche 2!");
          // si la requete contient un fichier et que tout se passe bien , on utilise sharp pour redimensionner et convertir l'image en format webp.

          await sharp(imagePath)
            .resize(800)
            .webp({ quality: 80 })
            .toFile(`${imagePath}-compressed.webp`);

          fs.unlinkSync(imagePath); // on supprime l'image d'origine
          console.log(imagePath);
          console.log(`Fichier d'origine supprimé : ${imagePath}`);
          fs.renameSync(`${imagePath}-compressed`, imagePath); // on renomme l'image compressée avec le nom de l'image d'origine
          console.log(`Fichier compressé renommé : ${imagePath}`);
        }

        next(); // on passe au middleware suivant
      } catch (error) {
        console.log("ERROR MULTER -- ", error);
        next(error);
      }
    });
  });
};
