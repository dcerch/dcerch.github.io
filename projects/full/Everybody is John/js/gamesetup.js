//Check to see if there are any existing players who joined and display them
for (i = 1; i <= 6; i++) {
  if(localStorage.getItem('p' + i + 'joined')) {
    $('#p' + i).html('<div class="card-block text-center card-success"><h2><b>' + localStorage.getItem('p' + i + 'name') + '</b> has already joined the game.</h2></div>');
  }
}

//DESCRIPTION: Pulls, assigns and stores player information into HTML5 local storage
function submitPlayer(slot) {
//Check browser support
if (typeof(Storage) !== 'undefined') {
  //Assign player information
  var willpower = 0;
  var playername = $('#' + slot + 'name').val();
  var playerobsession = $('#' + slot + 'obses').val();
  var playerskill = $('#' + slot + 'skill').val();
  if($('#' + slot + 'adds').prop('checked') == true) {
	willpower = 7;
  }
  else {
	willpower = 10;
  }

  //Store player information
  localStorage.setItem(slot + 'name', playername);
  localStorage.setItem(slot + 'obsession', playerobsession);
  localStorage.setItem(slot + 'skill', playerskill);
  localStorage.setItem(slot + 'willpower', willpower);
  localStorage.setItem(slot + 'joined', true);

  //Animate submission
  var animations = ["bounce", "flash", "pulse", "rubberBand", "shake", "headShake", "swing", "tada", "wobble", "jello", "bounceIn", "bounceInDown", "bounceInLeft", "bounceInRight", "bounceInUp", "fadeIn", "fadeInDown", "fadeInDownBig", "fadeInLeft", "fadeInLeftBig", "fadeInRight", "fadeInRightBig", "fadeInUp", "fadeInUpBig", "flipInX", "flipInY", "lightSpeedIn", "rotateIn", "rotateInDownLeft", "rotateInDownRight", "rotateInUpLeft", "rotateInUpRight", "rollIn", "zoomIn", "zoomInDown", "zoomInLeft", "zoomInRight", "zoomInUp", "slideInDown", "slideInLeft", "slideInRight", "slideInUp"];
  var randomanimation = animations[Math.floor(Math.random() * animations.length)];
  
  $('#' + slot).html('<div class="card-block"><h2><b>' + localStorage.getItem(slot + 'name') + '</b> has joined the game.</h2></div>');
  $('#' + slot).addClass('text-center card-success animated ' + randomanimation);
} else {
  //If local storage does not work on browser
  alert('Apologies, your browser does not support Web Storage which means you cannot play this game properly.');
}
}

//DESCRIPTION: Checks for minimum amount of players then runs through game logic
function startGame() {
//Valentine's Day 2017
if((localStorage.getItem("p1name") == "Abby") && (localStorage.getItem("p1obsession") == "Dwummers") && (localStorage.getItem("p2name") == "Dom") && (localStorage.getItem("p2obsession") == "Abae") && (localStorage.getItem("p1skill") == "Love") && (localStorage.getItem("p2skill") == "Love")) {
  location.replace("./valentines.html");
}

//Assign joined players to array
var currentplayers = [];
var offlineplayers = [];
for (i = 1; i <= 6; i++) {
  if(localStorage.getItem('p' + i + 'joined')) {
    currentplayers.push('p' + i);
  }
  else {
    offlineplayers.push('p' + i);
  }
}

//If at least three players have joined, play audio and start the game
if(currentplayers.length >= 3) {
  alert("Let the games begin");
  location.replace("game.html");
}
//If two or less players have joined, highlight players who haven't joined and provide alert
else {
  for (i = 0; i < offlineplayers.length; i++) {
    $('#' + offlineplayers[i]).addClass('card-warning');
  }
  alert("At least three players are required. Please add more in order to start.");
}
}

//DESCRIPTION: Clears HTML5 local storage to reset the game
function resetGame() {
var confirmreset = confirm("Resetting your game will result in all data being erased.\n\nClick OK to continue...");
if (confirmreset == true) {
  localStorage.clear();
  location.reload();
}
}