const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const livereload = require('livereload');
const connectLivereload = require('connect-livereload');

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

// 🔹 Page d'accueil


// 🔹 Voir tous les utilisateurs en JSON
app.get('/', async (req, res) => {
  User.find()

    .then((result)=>{
      res.render('index',{arr:result})
      console.log(result)
    })
    .catch((err)=>{
      console.log(err);
    })
});

// 🔹 Pages statiques
app.get('/user/add.html', (req, res) => res.render('user/add'));
app.get('/user/view.html', (req, res) => res.render('user/view'));
app.get('/user/edit.html', (req, res) => res.render('user/edit'));

// 🔹 Ajouter un utilisateur (formulaire)
app.post('/user/add.html', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.redirect('/user/view.html');
  } catch (error) {
    console.error("❌ Erreur ajout utilisateur :", error);
    res.status(500).send("Erreur lors de l'enregistrement de l'utilisateur.");
  }
});

// === Connexion MongoDB et lancement du serveur ===
mongoose
  .connect('mongodb+srv://haytam1331:bOFbsZlIOBnoGSAY@cluster0.5uydnqq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => {
    app.listen(port, () => {
      console.log(`✅ Serveur en cours d'exécution : http://localhost:${port}/`);
    });
  })
  .catch(err => {
    console.error('❌ Erreur de connexion MongoDB :', err);
  });
