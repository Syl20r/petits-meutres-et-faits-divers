var sock = io();

sock.on('pseudo', (nickname) => document.getElementById('pseudoClient').innerHTML = nickname);
sock.on('listePseudo', function(liste) {
  var ul = document.getElementById('pseudos');
  ul.innerHTML = ""; // reset la liste
  var lis = ul.getElementsByTagName("li");
  for (var i in liste) {
    // Anti-doublons
    var ok = true;
    for (var j in lis) {
      if (lis[j].id == liste[i][0]) {
        ok = false;
      }
    }
    if (ok) {
      var li = document.createElement('li');
      li.id = liste[i][0];
      li.className = "suspect";
      li.appendChild(document.createTextNode(liste[i][1]));
      ul.appendChild(li);
    }
  }
});
sock.on('id', function() {
  sock.emit('id', [getCookie('id'), getCookie('nickname')]);
});
sock.on('msg', (txt) => alert(txt));
sock.on('nbrJoueurs', (nbr) => document.getElementById('nbrJoueurs').innerHTML = nbr);

function mj() {
  sock.emit('mjDispo', true);
}

sock.on('mjDispo', function(data) {
  document.getElementById('boutonMj').disabled = !data.estDispo;
  if (data.estDispo && data.demande) {
    var txt = document.createElement('p');
    txt.id = "txtMj";
    txt.innerHTML = "Vous êtes <b>Maître du jeu</b>";

    var div = document.getElementById('maitre');
    var btn = document.createElement('input');
    btn.type = "button";
    btn.id = "jouer";
    btn.value = "Commencer la partie";
    btn.onclick = jouer;

    div.appendChild(txt);
    div.appendChild(btn);
    document.body.appendChild(div);
  }
});
sock.on('role', function(data) {
  document.getElementById('perso').style.display = "none";
  document.getElementById('mots').style.display = "none";
  var eRole = document.getElementById('role');
  var eName = document.getElementById('name');
  // Rôle
  eRole.innerHTML = data.role;
  if (data.role == "Coupable") {
    document.getElementById('tache').style.display = "inline";
  } else {
    document.getElementById('tache').style.display = "none";
  }

  console.log(data.name);
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
sock.on('affaire', function(aff) {
  // Date
  document.getElementById('date').innerHTML = aff.date;
  // Affaire
  document.getElementById('affaire').innerHTML = aff.histoire;
  // Icone inspecteur
  var ul = document.getElementById('pseudos');
  var lis = ul.getElementsByClassName('inspecteur');
  for (var i in lis) {
    lis[i].className = 'suspect';
  }
  var lis = ul.getElementsByClassName('suspect');
  console.log(lis.length);
  for (var i in lis) {
    if (i < lis.length) {
      console.log('lis[i] : ' + lis[i].id);
      if (lis[i].id == aff.inspecteur) {
        lis[i].className = 'inspecteur';
      }
    }
  }
  // Desc des perso
  var info_perso = document.getElementById('info_perso');
  info_perso.innerHTML = '';

  for (var i in aff.perso) { // https://prnt.sc/hf3jcl
    var li = document.createElement('li');
    var ul = document.createElement('ul');
    var name = document.createElement('li');
    var desc = document.createElement('li');

    name.appendChild(document.createTextNode(aff.perso[i].name));
    desc.appendChild(document.createTextNode(aff.perso[i].desc));

    ul.appendChild(name);
    ul.appendChild(desc);
    li.appendChild(ul);
    info_perso.appendChild(li);
  }
  document.getElementById('welcome').style.display = "none";
  document.getElementById('jeu').style.display = "inline";
});

function jouer() {
  console.log('jouer');
  var btn = document.getElementById('jouer');
  sock.emit('jouer');
  btn.value = "Changer d'affaire";
}

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
