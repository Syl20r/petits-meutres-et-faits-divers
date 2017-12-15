var sock = io();

// Le serveur demande id & nickname
sock.on('id', function() {
  // Envoie id & nickname stockés dans les cookies
  sock.emit('id', {'id': getCookie('id'), 'nickname': getCookie('nickname')});
});

// Bouton "Devenir MJ"
function mj() {
  // Demande à devenir MJ => true
  sock.emit('mjDispo', true);
}

// Reçoit les infos sur le MJ
sock.on('mjDispo', function(data) {
  // Déactive le bouton "Devenir MJ" si le poste n'est plus dispo
  document.getElementById('boutonMj').disabled = !data.estDispo;
  // Si le poste MJ était demandé
  if (data.estDispo && data.demande) {
    // Ajoute tout le HTML
    var txt = document.createElement('p');
    txt.id = "txtMj";
    txt.innerHTML = "Vous êtes <b>Maître du jeu</b>";

    var div = document.getElementById('maitre');
    var btn = document.createElement('button');
    btn.id = "jouer";
    btn.innerHTML = "Commencer la partie";
    btn.onclick = jouer;

    document.getElementById('boxPseudo').appendChild(txt);
    div.appendChild(btn);
    document.body.appendChild(div);
  }
});

// Reçoit le nbr de personnes connnectés sur le site
sock.on('nbrJoueurs', (nbr) => document.getElementById('nbrJoueurs').innerHTML = nbr);

// Bouton "Commencer une partie/Changer d'affaire"
function jouer() {
  var btn = document.getElementById('jouer');
  sock.emit('jouer');
  btn.innerHTML = "Changer d'affaire";
}

// Reçoit l'info sur le rôle du client
sock.on('role', function(data) {
  // Modif HTML
  document.getElementById('perso').style.display = "none";
  document.getElementById('mots').style.display = "none";
  var eRole = document.getElementById('role');
  var eName = document.getElementById('name');
  // Rôle
  eRole.innerHTML = data.role;
  // Affichage de la tache
  if (data.role == "Coupable") {
    document.getElementById('tache').style.display = "inline";
  } else {
    document.getElementById('tache').style.display = "none";
  }
  // Pas de personnage ni de mot pour l'inspecteur
  if (data.role != 'Inspecteur') {
    document.getElementById('perso').style.display = "inline";
    document.getElementById('mots').style.display = "inline";
    eName.innerHTML = data.name;
    // Mots
    var mots1 = document.getElementById('mots1');
    var mots2 = document.getElementById('mots2');
    mots1.innerHTML = '';
    mots2.innerHTML = '';

    for (var i in data.mots) {
      var mot = document.createElement('li');
      mot.appendChild(document.createTextNode(data.mots[i]));
      // Sépare les 6 mots en deux parties
      if (i < 3) {var ul = mots1;}
      else {var ul = mots2;}
      ul.appendChild(mot);
    }
  }
});

// Reçoit les infos sur l'affaire en cours
sock.on('affaire', function(aff) {
  // Date
  document.getElementById('date').innerHTML = aff.date;
  // Contexte
  document.getElementById('affaire').innerHTML = aff.histoire;
  /* Donne l'icone inspecteur à l'inspecteur
  / et les icones suspects aux suspects */
  var ul = document.getElementById('pseudos');
  var lis = ul.getElementsByClassName('inspecteur');
  for (var i in lis) {
    lis[i].className = 'suspect';
  }
  var lis = ul.getElementsByClassName('suspect');
  for (var i in lis) {
    if (i < lis.length) {
      if (lis[i].id == aff.inspecteur) {
        lis[i].className = 'inspecteur';
      }
    }
  }
  // Desc des perso
  var info_perso = document.getElementById('info_perso');
  info_perso.innerHTML = '';

  for (var i in aff.perso) { // https://prnt.sc/hf3jcl
    var table = document.createElement('table');
    var tr = document.createElement('tr');
    var tr2 = document.createElement('tr');
    var name = document.createElement('th');
    var desc = document.createElement('td');

    name.appendChild(document.createTextNode(aff.perso[i].name));
    desc.appendChild(document.createTextNode(aff.perso[i].desc));

    tr.appendChild(name);
    tr2.appendChild(desc);
    table.appendChild(tr);
    table.appendChild(tr2);
    info_perso.appendChild(table);
  }
  document.getElementById('welcome').style.display = "none";
  document.getElementById('jeu').style.display = "inline";
});

// Reçoit son propre pseudo pour l'afficher
sock.on('pseudo', (nickname) => document.getElementById('pseudoClient').innerHTML = nickname);

// Reçoit la liste des pseudos pour l'afficher
sock.on('listePseudo', function(liste) {
  var ul = document.getElementById('pseudos');
  ul.innerHTML = ""; // reset la liste
  var lis = ul.getElementsByTagName("li");
  for (var i in liste) {
    // Anti-doublons
    var ok = true;
    for (var j in lis) {
      if (lis[j].id == liste[i].id) {
        ok = false;
      }
    }
    if (ok) {
      var li = document.createElement('li');
      li.id = liste[i].id;
      li.className = "suspect";
      li.appendChild(document.createTextNode(liste[i].nickname));
      ul.appendChild(li);
    }
  }
});

// // Pour les tests :)
// sock.on('msg', (txt) => alert(txt));



function getCookie(c_name) {
  if (document.cookie.length > 0) {
    c_start = document.cookie.indexOf(c_name + "=");
    if (c_start != -1) {
      c_start = c_start + c_name.length + 1;
      c_end = document.cookie.indexOf(";", c_start);
      if (c_end == -1) c_end = document.cookie.length;
      return unescape(document.cookie.substring(c_start, c_end));
    }
  }
  return "";
}
