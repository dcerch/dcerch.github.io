/*
	ARG Part 1 - Symbols
*/
//What the user has to match
var user_sequence = [];
var konami_sequence = '99,117,114,105,111,115,105,116,121'; //this spells curiosity
var footer_symbols = document.getElementById('footersymbols');
var slogan_text = document.getElementById('slogan');

document.onkeypress = function (e) {
    e = e || window.event;
    user_sequence.push(e.keyCode);
    if(user_sequence.toString().indexOf(konami_sequence) >= 0) {
      //Hold onto original symbols
      var temporary_symbols = footer_symbols.innerHTML;
      //Fade symbols
      fade(footer_symbols);
      //Unfade new text
      setTimeout(function (){
        footer_symbols.innerHTML = 'You decide to click the symbols.';
        unfade(footer_symbols);
      }, 3000);
      //Fade new text
      setTimeout(function (){
        fade(footer_symbols);
      }, 6000);
      //Unfade original symbols
      setTimeout(function (){
        footer_symbols.innerHTML = temporary_symbols;
        unfade(footer_symbols);
      }, 9000);

      //Clear sequence
      user_sequence = [];
    }
};

function fade(element) {
  var op = 1;  // initial opacity
  var timer = setInterval(function () {
    if (op <= 0.1){
      clearInterval(timer);
      element.style.display = 'none';
    }
    element.style.opacity = op;
    element.style.filter = 'alpha(opacity=' + op * 100 + ')';
    op -= op * 0.1;
  }, 100);
}

function unfade(element) {
  var op = 0.1;  // initial opacity
  element.style.display = 'block';
  var timer = setInterval(function () {
    if (op >= 1){
      clearInterval(timer);
    }
    element.style.opacity = op;
    element.style.filter = 'alpha(opacity=' + op * 100 + ')';
    op += op * 0.1;
  }, 100);
}

//Clear variable and assign 10 random symbols
for(var i=0; i < 10; i++) {
  footer_symbols.innerHTML += set_randsym(17);
}

/*
	ARG Part 2 - Bio Change
*/

sessionStorage.clickcount = 1;

footer_symbols.addEventListener('click', function () {
  sessionStorage.clickcount = Number(sessionStorage.clickcount) + 1;
  if(sessionStorage.clickcount > 10) {
    slogan_text.innerHTML = 'Khajiit has wares, if you have <a href="https://dominiccerchio.com/projects/snippet/elderscrolls/index.html" style="text-decoration: none;">💰</a>';
  }
});
