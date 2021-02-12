//List of available 404 screens
const screens = ['space', 'starwars', 'matrix'];

//Randomly apply screens
switch(screens[Math.floor(Math.random()*screens.length)]) {
  case 'space':
    applySpace();
    break;
  case 'starwars':
    applyStarwars();
    $(document).ready(function(){
      setTimeout(function(){ $('.starwars img').fadeIn('slow'); }, 2000);
      setTimeout(function(){ $('.starwars div p').fadeIn('slow'); }, 4500);
      setTimeout(function(){ $('.starwars div button').fadeIn('slow'); }, 5500);
    });

    $('.starwars div button').click(function() {
      window.location.href = "index.html";
    });
    break;
  case 'matrix':
    applyMatrix();
    $(".matrix-wrap").click(function() {
      window.location.href = "index.html";
    });
    break;
}

//APPLY SPACE
function applySpace() {
  $('body').append('<link href="home/css/404-space.css" rel="stylesheet"><div class="space-background"><div class="space-foreground"><iframe src="https://www.youtube.com/embed/W0LHTWG-UmQ?controls=0&showinfo=0&rel=0&autoplay=1&loop=1&playlist=W0LHTWG-UmQ" frameborder="0" allowfullscreen></iframe></div></div><div class="space-info floating"><h1>404</h1><p>Actual live footage of trying to find the page you wanted... It is not looking so good.</p><p>Please check the URL for mistakes and try again or return <a href="index.html">home</a>... the website homepage... not Earth.</p></div>');
}

//APPLY STARWARS
function applyStarwars() {
  $('body').append('<link href="home/css/404-starwars.css" rel="stylesheet"><div class="starwars"><div><h1>404</h1><p>This is not the page you are looking for...</p><button type="button" class="btn btn-warning btn-lg">Move Along</button></div><img src="home/img/404-droids.gif" alt="404"></div>');
}

//APPLY MATRIX
function applyMatrix() {
  $('body').append('<link href="home/css/404-matrix.css" rel="stylesheet"><h1>404</h1><div class="matrix-container"><div class="matrix-text"></div></div><div class="matrix-wrap" title="Take the Blue Pill"><div class="matrix-cube"><div class="matrix-front">404</div><div class="matrix-back">404</div><div class="matrix-top"></div><div class="matrix-bottom"></div><div class="matrix-left">&#8962;</div><div class="matrix-right">&#8962;</div></div></div>');

  'use strict';
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  /*
    Text scramble logic
  */
  var TextScramble = function () {
    function TextScramble(el) {
      _classCallCheck(this, TextScramble);

      this.el = el;
      this.chars = '!<>-_\\/[]{}—=+*^?#________';
      this.update = this.update.bind(this);
    }

    TextScramble.prototype.setText = function setText(newText) {
      var _this = this;

      var oldText = this.el.innerText;
      var length = Math.max(oldText.length, newText.length);
      var promise = new Promise(function (resolve) {
        return _this.resolve = resolve;
      });
      this.queue = [];
      for (var i = 0; i < length; i++) {
        var from = oldText[i] || '';
        var to = newText[i] || '';
        var start = Math.floor(Math.random() * 40);
        var end = start + Math.floor(Math.random() * 40);
        this.queue.push({ from: from, to: to, start: start, end: end });
	  }
      cancelAnimationFrame(this.frameRequest);
      this.frame = 0;
      this.update();
      return promise;
    };

    TextScramble.prototype.update = function update() {
      var output = '';
      var complete = 0;
      for (var i = 0, n = this.queue.length; i < n; i++) {
        var _queue$i = this.queue[i];
        var from = _queue$i.from;
        var to = _queue$i.to;
        var start = _queue$i.start;
        var end = _queue$i.end;
        var char = _queue$i.char;

		if (this.frame >= end) {
          complete++;
          output += to;
		}
		else if (this.frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = this.randomChar();
            this.queue[i].char = char;
          }
          output += '<span class="matrix-dud">' + char + '</span>';
        }
		else {
          output += from;
        }
      }
      this.el.innerHTML = output;
      if (complete === this.queue.length) {
        this.resolve();
      }
	  else {
        this.frameRequest = requestAnimationFrame(this.update);
        this.frame++;
      }
    };

	TextScramble.prototype.randomChar = function randomChar() {
      return this.chars[Math.floor(Math.random() * this.chars.length)];
    };

	return TextScramble;
  }();

  /*
    Start text scramble
  */

  var phrases = ['User,', 'sooner or later', 'you\'re going to realize', 'just as I did', 'that there\'s a difference', 'between knowing the page', 'and finding the page'];

  var el = document.querySelector('.matrix-text');
  var fx = new TextScramble(el);

  var counter = 0;
  var next = function next() {
    fx.setText(phrases[counter]).then(function () {
      setTimeout(next, 800);
    });
    counter = (counter + 1) % phrases.length;
  };

  next();
}
