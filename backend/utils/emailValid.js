// Import du plugin 'validator'

const validator = require("validator");

// Fonction de la validité de l'email

const isEmailValid = (email) => validator.isEmail(email);

// Exports

module.exports = isEmailValid;
