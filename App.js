const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const port = 3002;
app.use(express.urlencoded({ extended: true }));
// Import du modèle
const Article = require('./models/Text');

// Middleware pour parser les données des formulaires
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Affiche la page d'accueil
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Home.html'));
});

// Reçoit les données du formulaire
app.post('/add-text', (req, res) => {
  const article = new Article({
    text: req.body.text
  });

  article
    .save()
    .then(result => {
      console.log('Article enregistré:', result);
      res.redirect('/');
    })
    .catch(err => {
      console.error('Erreur enregistrement article:', err);
      res.status(500).send('Erreur serveur');
    });
});

// Connexion à MongoDB et lancement du serveur
mongoose
  .connect("mongodb+srv://haytam1331:bOFbsZlIOBnoGSAY@cluster0.5uydnqq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => {
    app.listen(port, () => {
      console.log(`Serveur en cours d'exécution : http://localhost:${port}/`);
    });
  })
  .catch(err => {
    console.error('Erreur de connexion MongoDB :', err);
  });
