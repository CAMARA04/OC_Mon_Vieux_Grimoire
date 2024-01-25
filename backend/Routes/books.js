const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const multer = require("../middleware/multer-config");

const booksCtrl = require("../controllers/books");

router.get("/", booksCtrl.getAllBooks);
router.post("/", auth, multer, booksCtrl.createBook);
router.put("/:id", auth, multer, booksCtrl.modifyBook);
router.get("/bestrating", booksCtrl.getBestRatedBooks);
router.post("/:id/rating", auth, booksCtrl.rateBook);
router.delete("/:id", auth, booksCtrl.deleteBook);
router.get("/:id", booksCtrl.getOneBook);

module.exports = router;
