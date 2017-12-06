var sock = io();

function giveId() {
  setCookie('id', Math.random(), 30);
}

function login() {
  var name = document.getElementById('pseudo').value;
  setCookie('nickname', name, 30);
  location.href = 'game.html';
}

function setCookie(cname,cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";domain=localhost;" + expires + ";path=/";
}
