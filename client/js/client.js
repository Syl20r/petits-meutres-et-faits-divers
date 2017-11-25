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

function mj() {
  sock.emit('mj');
}

function jouer() {
  sock.emit('jouer');
}
