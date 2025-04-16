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
const Article = require('./models/Text');

// === Routes ===
app.get('/', (req, res) => res.render('index'));
app.get('/user/add.html', (req, res) => res.render('user/add'));
app.get('/user/view.html', (req, res) => res.render('user/view'));
app.get('/user/edit.html', (req, res) => res.render('user/edit'));

// === MongoDB Connection and Server Start ===
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
