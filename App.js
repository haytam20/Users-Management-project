const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const livereload = require('livereload');
const connectLivereload = require('connect-livereload');
//moment
var moment = require('moment'); // require
; 

//port
const app = express();
const port = 3002;

// === LiveReload Setup ===
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, 'public'));

app.use(connectLivereload());
liveReloadServer.server.once('connection', () => {
  setTimeout(() => {
    liveReloadServer.refresh('/');
  }, 100);
});

// === Middleware ===
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// === EJS View Engine ===
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// === MongoDB Model ===
const User = require('./models/User');

// === Routes ===

// 🔹 Page d'accueil : liste tous les utilisateurs
app.get('/', async (req, res) => {
  User.find()
    .then((result) => {
      res.render('index', { arr: result,moment:moment });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Erreur lors de la récupération des utilisateurs.");
    });
});

// 🔹 Formulaire d'ajout utilisateur
app.get('/user/add.html', (req, res) => res.render('user/add'));

// 🔹 Formulaire d'édition (à compléter si nécessaire)
app.get('/user/edit.html', (req, res) => res.render('user/edit'));

// 🔹 Ajouter un utilisateur
app.post('/user/add.html', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.redirect('/');
  } catch (error) {
    console.error("❌ Erreur ajout utilisateur :", error);
    res.status(500).send("Erreur lors de l'enregistrement de l'utilisateur.");
  }
});

// 🔹 Voir un utilisateur spécifique (IMPORTANT : route dynamique avec id)
app.get("/user/:id", (req, res) => {
  User.findById(req.params.id)
    .then((result) => {
      if (!result) return res.status(404).send("Utilisateur non trouvé.");
      res.render('user/view', { arr: result });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Erreur serveur.");
    });
});

// === Connexion MongoDB et lancement du serveur ===
mongoose
  .connect('mongodb+srv://haytam1331:bOFbsZlIOBnoGSAY@cluster0.5uydnqq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => {
    app.listen(port, () => {
      console.log(`✅ Serveur lancé : http://localhost:${port}/`);
    });
  })
  .catch(err => {
    console.error('❌ Erreur de connexion MongoDB :', err);
  });
