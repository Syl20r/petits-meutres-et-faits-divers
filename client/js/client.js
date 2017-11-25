var sock = io();

sock.on('mjDispo', (bool) => document.getElementById('boutonMj').disabled = !bool);
sock.on('msg', (txt) => alert(txt));
sock.on('nbrJoueurs', (nbr) => document.getElementById('nbrJoueurs').innerHTML = nbr);
sock.on('mj', function(estMaitre) {
  if (estMaitre) {
    var txt = document.createElement('p');
    txt.id = "txtMj";
    txt.innerHTML = "Vous êtes <b>Maître du jeu</b>";

    var div = document.getElementById('maitre');

    var btn = document.createElement('input');
    btn.type = "button";
    btn.id = "jouer";
    btn.value = "Commencer la partie";
    btn.onclick= jouer;


    div.appendChild(txt);
    div.appendChild(btn);
    document.body.appendChild(div);
  }
})

sock.on('role', (role) => document.getElementById('role').innerHTML = role);
sock.on('name', function functionName(name) {
  document.getElementById('perso').style.display = "inline";
  document.getElementById('name').innerHTML = name;
});
sock.on('infoPerso', function (perso) {
  var info_perso = document.getElementById('info_perso');
  for (var i in perso) { // https://prnt.sc/hf3jcl
    var li = document.createElement('li');
    var ul = document.createElement('ul');
    var name = document.createElement('li');
    var desc = document.createElement('li');

    name.appendChild(document.createTextNode(perso[i].name));
    desc.appendChild(document.createTextNode(perso[i].desc));

    ul.appendChild(name);
    ul.appendChild(desc);
    li.appendChild(ul);
    info_perso.appendChild(li);
  }
});
sock.on("date", function (date) {
  document.getElementById('date').innerHTML = date;
})
sock.on('mots', function (mots) {
  for (var i in mots) {
    var mot = document.createElement('li');
    mot.appendChild(document.createTextNode(mots[i]));

    if (i <3) {
      var ul = document.getElementById('mots1');
    } else {
      var ul = document.getElementById('mots2');
    }
    ul.appendChild(mot);
  }
});

function mj() {
  sock.emit('mj');
}

function jouer() {
  sock.emit('jouer');
}
