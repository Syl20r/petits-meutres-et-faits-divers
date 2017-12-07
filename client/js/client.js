var sock = io();

sock.on('pseudo', (nickname) => document.getElementById('pseudoClient').innerHTML = nickname);
sock.on('listePseudo', function (liste) {
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
      var icone = document.createElement('i');
      var li = document.createElement('li');
      li.id = liste[i][0];
      icone.className = "fa fa-user";
      li.appendChild(icone);
      li.appendChild(document.createTextNode('  ' + liste[i][1]));
      ul.appendChild(li);
    }
  }
});
sock.on('id', function () {
  sock.emit('id', [getCookie('id'), getCookie('nickname')]);
});
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
});

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
});
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
  var btn = document.getElementById('jouer');
  sock.emit('jouer');
  btn.value = "Changer d'affaire";
  document.getElementById('mots1').innerHTML = '';
  document.getElementById('mots2').innerHTML = '';
  document.getElementById('info_perso').innerHTML = '';
}

function getCookie(c_name)
{
if (document.cookie.length>0)
  {
  c_start=document.cookie.indexOf(c_name + "=");
  if (c_start!=-1)
    {
    c_start=c_start + c_name.length+1;
    c_end=document.cookie.indexOf(";",c_start);
    if (c_end==-1) c_end=document.cookie.length;
    return unescape(document.cookie.substring(c_start,c_end));
    }
  }
return "";
}
