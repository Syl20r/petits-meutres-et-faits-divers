var sock = io();

function giveId() {
  setCookie('id', Math.random(), 30);
}

function login() {
  var name = document.getElementById('pseudo').value;
  if (name.length > 17) {
    document.getElementById('error').style.display = "inline";
  } else {
    setCookie('nickname', name, 30);
    location.href = 'game.html';
  }
}

function setCookie(cname,cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

// Entrer => clique bouton
$(document).ready(function(){
    $('#pseudo').keypress(function(e){
      if(e.keyCode==13) {
        $('button[name="login"]').click();
      }
    });
});
