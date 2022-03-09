//Middleware vérifiant l'authentification de l'utilisateur avant d'envoyer les requêtes

const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  try {  // extraction du token, decodage et vérification si corresspond à celui de l'utilisateur
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, `${process.env.CODE_TOKEN}`);
    const userId = decodedToken.userId;
    req.auth = {userId};
    if (req.body.userId && req.body.userId !== userId) { // si non on envoie un message d'erreur
      throw 'Invalid user ID';
    } else {
      next();  // si oui on passe au middleware suivant
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};