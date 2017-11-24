var sock = io();

// Reception d'un msg
sock.on('msg', onConnection);

function onConnection(text) {
  var el = document.getElementById('connexion');
  el.innerHTML = text;
}125874
