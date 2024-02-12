//*******Routeur Express pour gérer les requêtes liées à l'inscription et à la connexion des utilisateurs***/

const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");

router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;
