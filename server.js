'use strict';
// Import
let http = require('http');
let express = require('express');
let socketio = require('socket.io');
let game = require('./game');

// Affaires (json)
var affaires = require('./affaires.json');

// Application
let app = express();
let server = http.createServer(app);
let io = socketio(server);

var SOCKET_LIST = {}; // Liste des clients [id]
var MJ_DISPO = true; // Si le poste de MJ est dispo => true

// Le navigateur web ouvre directement le dossier 'client' => index.html
app.use(express.static(__dirname + '/client'));
server.listen(process.env.PORT || 8080, console.log('Ecoute du port ...'));

// Quand un client se connecte
io.on('connection', function(sock) {
  // Demande l'id et le nickname
  io.emit('id');
  // Reçoit id et nickname
  sock.on('id', function(dict) {
    // Ajoute les infos au client (sock)
    sock.id = dict.id;
    sock.nickname = dict.nickname;
    // Ajoute le client dans la liste des clients
    SOCKET_LIST[sock.id] = sock;
    /* Actualise la liste des joueurs sur la page
    / Ajoute le nom du joueur sur sa page */
    sendPseudos(sock.id);
  });
  /* Envoie l'info sur la disponibilité du poste MJ
  / demande=false car c'est juste pour info */
  sock.emit('mjDispo', {estDispo: MJ_DISPO, demande:false});
  // On informe les clients du nbr de clients connectés
  io.emit('nbrJoueurs', io.engine.clientsCount);
  // Si le client se déconnecte
  sock.on('disconnect', function() {
    // On le retire de SOCKET_LIST
    delete SOCKET_LIST[sock.id];
    // On informe les clients du nouveau nbr de clients connectés
    io.emit('nbrJoueurs', io.engine.clientsCount);
    // Si ce client était MJ alors le poste MJ est libre
    if (sock.mj == true) {
      io.emit('mjDispo', {estDispo: true, demande:false});
      MJ_DISPO = true;
    }
    // Actualise la liste des joueurs sur la page
    sendPseudos(sock.id);
  })

  // Si on demande à devenir MJ
  sock.on('mjDispo', function(demande) {
    // On vérifie si MJ est dispo
    if (MJ_DISPO == true) {
      sock.mj = true;
      MJ_DISPO = false;
      SOCKET_LIST[sock.id] = sock;
      sock.emit('mjDispo', {estDispo: true, demande:true});
      io.emit('mjDispo', {estDispo: false, demande:false});
    }
  });

  // Démarre la partie (bouton "Commencer une partie/Changer d'affaire")
  sock.on('jouer', function() {
    var joueurMax = 3;
    // Choisit une affaire au hasard
    var rAff = Math.floor(Math.random() * (affaires.length));
    var affaire = affaires[rAff];
    // 6 joueurs max, les autres en trop sont refoulés
    game.fillRoles(Math.min(io.engine.clientsCount, joueurMax));
    // Donne un rôle à chaque client
    var n = 0; // Donne les noms
    var j = 0; // 6 joueurs max
    for (var i in SOCKET_LIST) {
      if (j < joueurMax) {
        var s = SOCKET_LIST[i];
        var data = {};
        data.role = game.donneRole();
        // Inspecteur
        if (data.role == "Inspecteur") {
          affaire.inspecteur = s.id;
        } else { // L'inspecteur n'a pas de personnage
          // Nom du personnage
          data.name = affaire.perso[n].name;
          n++;
          // Mots, differents pour les innocents et le coupable
          if (data.role == "Coupable") {
            data.mots = affaire.coupable;
          } else {
            data.mots = affaire.innocent;
          }
        }
      } else {
        data.role = "Spectateur";
      }
      // Envoie les infos propres à chaque client (indépendamment)
      s.emit("role", data);
      j++;
    }
    // Envoie les infos sur l'affaire à tous les clients
    io.emit("affaire", affaire);
  });
});

/* Actualise la liste des joueurs sur la page
/ Ajoute le nom du joueur sur sa page */
function sendPseudos(id) {
  var listeJoueurs = [];
  for (var i in SOCKET_LIST) {
    var s = SOCKET_LIST[i];
    // liste joueurs
    listeJoueurs.push({'id': s.id, 'nickname': s.nickname});
    //Ajoute le nom du joueur sur sa page
    if (s.id == id) {
      s.emit('pseudo', s.nickname);
    }
  }
  // Envoie la liste
  io.emit('listePseudo', listeJoueurs);
}
