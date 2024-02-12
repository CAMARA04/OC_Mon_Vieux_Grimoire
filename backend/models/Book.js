// *******Schema de données pour un modèle de livre*******

const mongoose = require("mongoose"); //import du module mongoose(bibliotheque Javascript)

const bookSchema = mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  ratings: [
    {
      userId: { type: String, required: true },
      grade: { type: Number, required: true },
    },
  ],
  averageRating: { type: Number, default: 0, required: true },
});

// Creation du modéle de données pour le livre
module.exports = mongoose.model("Book", bookSchema);
