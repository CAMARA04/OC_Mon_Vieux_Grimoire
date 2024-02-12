const passwordValidator = require("password-validator"); //import du module

const passwordSchema = new passwordValidator();
passwordSchema
  .is()
  .min(8) // Longueur minimale de 8 caractères
  .is()
  .max(100) // Longueur maximale de 100 caractères
  .has()
  .uppercase() // Doit contenir des lettres majuscules
  .has()
  .lowercase() // Doit contenir des lettres minuscules
  .has()
  .digits() // Doit contenir des chiffres
  .has()
  .symbols(); // Doit contenir des symboles

module.exports = passwordSchema;

const isPasswordValid = (password) => passwordSchema.validate(password);

const validationMessages = (password) => {
  let message = "";

  const arr = passwordSchema.validate(password, { details: true });

  for (let i = 0; i < arr.length; i++) {
    message += arr[i].message + "***";
  }
  return message;
};

module.exports = { isPasswordValid, validationMessages };
