//*********Schema de données pour un modèle d'utilisateur ***********

const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

//Pour s'assurer que la proprieté e-mail est unique dans la collection des utilisateurs
userSchema.plugin(uniqueValidator);

//Création d'un modèle de données pour User
module.exports = mongoose.model("User", userSchema);
