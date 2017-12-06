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
var MJ = false; // Maitre du Jeu

// Quand un client se connecte
io.on('connection', function (sock) {
  io.emit('id'); // Demande l'id et le nickname
  sock.on('id', function (tab) { // Reçoit id et nickname
    sock.id = tab[0]; // identité unique
    sock.nickname = tab[1];
    SOCKET_LIST[sock.id] = sock;

    // Ajoute le joueur dans la liste et sur sa page
    var listeJoueurs = [];
    for (var i in SOCKET_LIST) {
      var s = SOCKET_LIST[i];
      // liste joueurs
      listeJoueurs.push([s.id, s.nickname]);
      if (s.id == sock.id) {
        s.emit('pseudo', s.nickname);
      }
    }
    io.emit('listePseudo', listeJoueurs);
  });

   // On informe les clients du nbr de clients connectés
  io.emit('nbrJoueurs', io.engine.clientsCount);

  // Si un client se déconnecte on le retire de SOCKET_LIST
  sock.on('disconnect', function () {
    delete SOCKET_LIST[sock.id];
    io.emit('nbrJoueurs', io.engine.clientsCount);
    if (sock.mj == true) {
      io.emit('mjDispo', true);
    }
  })

  // Demande à devenir MJ
  sock.on('mj', function () {
    var possible = true; // Teste si il y a déjà un MJ
    for (var i in SOCKET_LIST) {
      if (SOCKET_LIST[i].mj == true) {
        possible = false;
      }
    }
    if (possible == true) {
      sock.mj = true;
      SOCKET_LIST[sock.id] = sock;
      sock.emit('mj', true);
      io.emit('mjDispo', false);
    }
  });
  // Démarre la partie
  sock.on('jouer', function () {
    var affaire = affaires[Math.floor(Math.random()*affaires.length)];
    game.fillRoles(Math.min(io.engine.clientsCount, 6)); // Pour l'instant 5 joueurs max
    // Donne un rôle à chaque client
    var n = 0; //Donne les noms
    var j = 0; // 6 joueurs max
    for (var i in SOCKET_LIST) {
      if (j < 6) {
        var s = SOCKET_LIST[i];
        var role = game.donneRole();
        s.emit('role', role);
        if (role != "Inspecteur") {
          var name = affaire.perso[n].name; // Nom du personnage
          s.emit('name', name);
          n++;
          if (role == "Coupable") {
            s.emit("mots", affaire.coupable);
          } else {
            s.emit("mots", affaire.innocent);
          }
        }
        s.emit("infoPerso", affaire.perso);
        s.emit("date", affaire.date);
        console.log(name + ' est ' + role);
      }
      j++;

    }
  });
});

// Le navigateur web ouvre directement le dossier 'client' => index.html
app.use(express.static(__dirname + '/client'));
server.listen(process.env.PORT || 8080, () => console.log('Listening ...'));
