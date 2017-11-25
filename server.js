'use strict';
// Importations
let http = require('http');
let express = require('express');
let socketio = require('socket.io');
let game = require('./game');

// Application
let app = express();
let server = http.createServer(app);
let io = socketio(server);

var SOCKET_LIST = {}; // Liste des clients
var MJ = false; // Maitre du Jeu

// Quand un client se connecte
io.on('connection', function (sock) {
  sock.id = Math.random(); // identité unique
  SOCKET_LIST[sock.id] = sock;
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
    game.fillRoles(io.engine.clientsCount);
    // Donne un rôle à chaque client
    for (var i in SOCKET_LIST) {
      var s = SOCKET_LIST[i];
      s.emit('role', game.donneRole());
    }
  });
});

// Le navigateur web ouvre directement le dossier 'client' => index.html
app.use(express.static(__dirname + '/client'));
server.listen(process.env.PORT || 8080, () => console.log('Listening ...'));
