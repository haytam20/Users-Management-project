const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const livereload = require('livereload');
const connectLivereload = require('connect-livereload');
//moment
var moment = require('moment'); // require
//override
var methodOverride = require('method-override')

// Initialize app first
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

// Add methodOverride middleware after app initialization
app.use(methodOverride('_method'));

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
      res.render('index', { arr: result, moment: moment });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Erreur lors de la récupération des utilisateurs.");
    });
});

// 🔹 Formulaire d'ajout utilisateur
app.get('/user/add.html', (req, res) => res.render('user/add'));

// 🔹 Formulaire d'édition (à compléter si nécessaire)
app.get("/edit/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id); // get user data
    if (!user) return res.status(404).send("Utilisateur non trouvé.");
    res.render("user/edit", { arr: user }); // pass it to EJS
  } catch (err) {
    console.error("❌ Erreur récupération utilisateur :", err);
    res.status(500).send("Erreur serveur.");
  }
});

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
app.get("/view/:id", (req, res) => {
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

// 🔹 Supprimer un utilisateur
app.delete("/delete/:id", async (req, res) => {
  try {
    const result = await User.findByIdAndDelete(req.params.id);
    res.redirect("/");  // Redirect after deletion

    console.log(result);  // Log the result of the deletion
  } catch (err) {
    console.error("❌ Erreur suppression utilisateur :", err);
    res.status(500).send("Erreur lors de la suppression de l'utilisateur.");
  }
});

// 🔹 Mettre à jour un utilisateur (mettre à jour avec PUT)
app.put('/edit/:id', async (req, res) => {
  try {
    const userId = req.params.id; // Récupérer l'ID de l'utilisateur depuis les paramètres de l'URL
    const updatedData = req.body; // Récupérer les données mises à jour du formulaire

    // Mettre à jour l'utilisateur dans la base de données
    const user = await User.findByIdAndUpdate(userId, updatedData, { new: true });

    if (!user) {
      return res.status(404).send("Utilisateur non trouvé.");
    }

    // Rediriger vers la page de l'utilisateur mis à jour
    res.redirect(`/view/${user._id}`);
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour de l'utilisateur :", error);
    res.status(500).send("Erreur lors de la mise à jour de l'utilisateur.");
  }
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
