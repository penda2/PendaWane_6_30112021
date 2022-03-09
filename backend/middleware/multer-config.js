// middleware gérant les fichiers entrants 
const multer = require('multer');

const MIME_TYPES = { // gestion de l'extension des fichiers
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({ // stockage des images dans le dossier images 
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => { // création du fichier entier après remplacement des espaces par des underscores
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

module.exports = multer({storage: storage}).single('image');