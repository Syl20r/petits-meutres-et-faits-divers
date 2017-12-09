'use strict';
// Importations
let http = require('http');
let express = require('express');
let socketio = require('socket.io');
let game = require('./game');

// Affaires (json)
var affaires = require('./affaires.json')

// Application
let app = express();
let server = http.createServer(app);
let io = socketio(server);

var SOCKET_LIST = {}; // Liste des clients
var MJ_DISPO = true;

// Quand un client se connecte
io.on('connection', function(sock) {
  io.emit('id'); // Demande l'id et le nickname
  sock.on('id', function(tab) { // Reçoit id et nickname
    sock.id = tab[0]; // identité unique
    sock.nickname = tab[1];
    SOCKET_LIST[sock.id] = sock;
    sendPseudos(sock.id);
  });
  sock.emit('mjDispo', {estDispo: MJ_DISPO, demande:false});

  // On informe les clients du nbr de clients connectés
  io.emit('nbrJoueurs', io.engine.clientsCount);

  // Si un client se déconnecte on le retire de SOCKET_LIST
  sock.on('disconnect', function() {
    delete SOCKET_LIST[sock.id];
    io.emit('nbrJoueurs', io.engine.clientsCount);
    if (sock.mj == true) {
      io.emit('mjDispo', {estDispo: true, demande:false});
      MJ_DISPO = true;
    }
    sendPseudos(sock.id);
  })

  // Demande à devenir MJ
  sock.on('mjDispo', function(demande) {
    if (MJ_DISPO == true) {
      sock.mj = true;
      MJ_DISPO = false;
      SOCKET_LIST[sock.id] = sock;
      sock.emit('mjDispo', {estDispo: true, demande:true});
      io.emit('mjDispo', {estDispo: false, demande:false});
    }
  });
  // Démarre la partie
  sock.on('jouer', function() {
    var rAff = Math.floor(Math.random() * (affaires.length)); // Choisit une affaire au hasard
    var affaire = affaires[rAff];
    game.fillRoles(Math.min(io.engine.clientsCount, 6)); // Pour l'instant 5 joueurs max
    // Donne un rôle à chaque client
    var n = 0; // Donne les noms
    var j = 0; // 6 joueurs max
    for (var i in SOCKET_LIST) {
      if (j < 6) {
        var s = SOCKET_LIST[i];
        var data = {};
        data.role = game.donneRole();
        if (data.role == "Inspecteur") { // Inspecteur
          affaire.inspecteur = s.id;
        } else {
          data.name = affaire.perso[n].name; // Nom du personnage
          n++;
          if (data.role == "Coupable") {
            data.mots = affaire.coupable;
          } else {
            data.mots = affaire.innocent;
          }
        }
        //console.log(data);
        s.emit("role", data);
      }
      j++;
    }
    io.emit("affaire", affaire);
  });
});

// Actualise/Ajoute le joueur dans la liste et sur sa page
function sendPseudos(id) {
  var listeJoueurs = [];
  for (var i in SOCKET_LIST) {
    var s = SOCKET_LIST[i];
    // liste joueurs
    listeJoueurs.push([s.id, s.nickname]);
    if (s.id == id) {
      s.emit('pseudo', s.nickname);
    }
  }
  io.emit('listePseudo', listeJoueurs);
}

// Le navigateur web ouvre directement le dossier 'client' => index.html
app.use(express.static(__dirname + '/client'));
server.listen(process.env.PORT || 8080, () => console.log('Listening ...'));
