const express = require('express');
const mongoose = require('mongoose');
const path = require('path'); 
const app = express();
const port = 3002;

app.use(express.static('public'));

const livereload = require('livereload');
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, 'public'));

// Auto refresh
const connectLivereload = require('connect-livereload');
app.use(connectLivereload());

liveReloadServer.server.once('connection', () => {
  setTimeout(() => {
    liveReloadServer.refresh('/');
  }, 100);
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// EJS setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Import model
const Article = require('./models/Text');

// Routes
app.get('/', (req, res) => {
  res.render('Home');
});

app.post('/add-text', (req, res) => {
  const article = new Article({
    text: req.body.text,
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

// MongoDB connection and server start
mongoose
  .connect(
    'mongodb+srv://haytam1331:bOFbsZlIOBnoGSAY@cluster0.5uydnqq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
  )
  .then(() => {
    app.listen(port, () => {
      console.log(`Serveur en cours d'exécution : http://localhost:${port}/`);
    });
  })
  .catch(err => {
    console.error('Erreur de connexion MongoDB :', err);
  });