//modele de données utilisateur pour éviter d'avoir plusieurs users avec la même adresse email
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator); // enregistrement du plugin sur le model/schema

module.exports = mongoose.model('User', userSchema);