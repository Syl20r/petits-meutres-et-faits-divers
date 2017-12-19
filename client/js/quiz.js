$(document).ready(function() {
        $.getJSON("js/questions.json", function(result) {
            result.forEach(function(i, item) {
                $(".questions").append(`<li id="q${item}">
                  <p>${i.question}</p>
                    <input type="radio" name="question-${item}" value="a">${i.a}</input>
                    <input type="radio" name="question-${item}" value="b">${i.b}</input>
                    <input type="radio" name="question-${item}" value="c">${i.c}</input>
                  </li>`);
            });
        });
});

function valider() {
  document.getElementsByClassName('reponse').remove();
  $.getJSON("js/questions.json", function(result) {
      result.forEach(function(i, item) {
         var rep = document.querySelector("input[name=question-" + item + "]:checked").value;
         console.log(`.q${item}`);
        if (rep == i.reponse) {
          $(`#q${item}`).after('<p class="reponse">Bonne réponse bravo !</p>');
        }
        else {
          $(`#q${item}`).after('<p class="reponse">Mauvais réponse :(</p>');
        }
      });
  });

}

// Pour supprimer les elements d'un tableau
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}
