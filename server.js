'use strict';
let http = require('http');
let express = require('express');
// Application
let app = express();
let server = http.createServer(app);

// Le navigateur ouvre directement le dossier 'client'
app.use(express.static(__dirname + '/client'));

server.listen(process.env.PORT || 8080, () => console.log('Ecoute du port ...'))
