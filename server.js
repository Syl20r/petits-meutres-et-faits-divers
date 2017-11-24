'use strict';
let http = require('http');
let express = require('express');
let socketio = require('socket.io');

// Application
let app = express();
let server = http.createServer(app);
let io = socketio(server);

// Reception d'une connexion alors on execute la fonction ...
io.on('connection', () => sock.emit('msg', 'Hello!'));

// Le navigateur ouvre directement le dossier 'client'
app.use(express.static(__dirname + '/client'));

server.listen(process.env.PORT || 8080, () => console.log('Ecoute du port ...'))
