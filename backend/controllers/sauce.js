const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => { // suppression de l'id envoyé par le frontend, creation d'un objet et son enregistrement dans la BDD
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'sauce enregistrée !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => { // dans cette fonction on accède à une sauce précise
  Sauce.findOne({_id: req.params.id})
  .then((sauce) => {res.status(200).json(sauce)}
  ).catch((error) => {res.status(404).json({ error })});
};

exports.modifySauce = (req, res, next) => { // si l'utilisateur est le créateur il peut modifier une sauce, sinon reçoit un message d'erreur
  Sauce.findOne({ _id: req.params.id })
  .then(sauce => {
    if(req.auth.userId === sauce.userId){
      const sauce = new Sauce({
        _id: req.params.id,
        name: req.body.name,
        manufacturer: req.body.manufacturer,
        description: req.body.description,
        mainPepper: req.body.mainPepper,
        imageUrl: req.body.imageUrl,
        userId: req.body.userId
      });
      Sauce.updateOne({_id: req.params.id}, sauce)
      .then(() => {res.status(201).json({message: 'Sauce modifiée avec succés!'});
        })
        .catch((error) => {res.status(403).json({ error })});

  } else{
    res.status(401).json({message:"non autorisé !"});
  }
  })
  .catch(error => res.status(500).json({ error }));
};

exports.deleteSauce = (req, res, next) => { // si l'utilisateur est le créateur il peut supprimer une sauce, sinon reçoit un message d'erreur
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      if(req.auth.userId === sauce.userId){
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
      });
    } else{
      res.status(401).json({message:"non autorisé !"});
    }
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getAllSauce = (req, res, next) => { // dans cette fonction on accède à toutes les sauces 
  Sauce.find()
  .then((sauce) => {res.status(200).json(sauce)})
  .catch((error) => {res.status(400).json({ error })});
};
// Gestion de l'id de l'utilisateur en fonction du like/dislike
exports.likeSauce = (req, res, next) => { 
  Sauce.findOne({_id: req.params.id})
  .then((sauce) => {
    if (req.body.like == 1) {
      if (!sauce.usersLiked.includes(req.body.userId) && !sauce.usersDisliked.includes(req.body.userId)) { 
        sauce.usersLiked.push(req.body.userId)
        sauce.likes++
      }
    }
    else if (req.body.like == 0) {
      if (sauce.usersLiked.includes(req.body.userId)) { 
        sauce.usersLiked.pull(req.body.userId)
        sauce.likes--
      }
      if (sauce.usersDisliked.includes(req.body.userId)) { 
        sauce.usersDisliked.pull(req.body.userId)
        sauce.dislikes--
      }
    }
    else if (req.body.like == -1) {
      if (!sauce.usersLiked.includes(req.body.userId) && !sauce.usersDisliked.includes(req.body.userId)) { 
        sauce.usersDisliked.push(req.body.userId)
        sauce.dislikes++
      }
    }
    sauce.save()
    res.status(200).json({ message: 'sauce bien modifiée'})
  })
  .catch((error) => {res.status(404).json({ error })});  
};