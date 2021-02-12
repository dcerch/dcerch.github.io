// TODO: Save game feature (save game after on change events - when points get updated, names changed, players added)

var jsonstorage = {
  'p1': ['Ricky', 0],
  'p2': ['Abby', 0],
  'p3': ['Avianne', 0]
};

saveGame();

/*
  INITALIZE GAME
*/
//Check for storage capability
if (typeof(Storage) !== 'undefined') {
  if(typeof localStorage.pointkeeper !== 'undefined' && localStorage.pointkeeper !== null && localStorage.pointkeeper !== '') {
    $.each(JSON.parse(localStorage.pointkeeper), function(playerid, info) {
      updatePlayers(playerid, info);
    });
  }
}
else {
  $('body').html('<div class="alert alert-danger my-3" role="alert">Your browser does not support certain functionality of this application. Please try another browser.</div>');
}

function updatePlayers(playerid, info) {
  var playerinfo = '';
  playerinfo += '<div class="col-sm col-md-4 col-lg-3" id=' + playerid + '>';
  playerinfo += '<input type="text" class="form-control text-center" value="' + info[0] + '">';
  playerinfo += '<div class="input-group input-group-lg mb-3 text-center">';
  playerinfo += '<div class="input-group-prepend"><button class="btn btn-outline-danger" type="button"><i class="fa fa-minus" aria-hidden="true"></i></i></button></div>';
  playerinfo += '<input type="number" class="form-control text-center" value="' + info[1] + '" disabled>';
  playerinfo += '<div class="input-group-append"><button class="btn btn-outline-primary" type="button"><i class="fa fa-plus" aria-hidden="true"></i></button></div>';
  playerinfo += '</div></div>';
  $('#player-display').append(playerinfo);
}

/*
  UPDATE POINTS
*/
$('button').click(function() {
  var playerid = $(this).parent().parent().parent().attr('id');
  if(this.className == 'btn btn-outline-primary') {
    $('#' + playerid + ' div input').val(function(i, previousvalue) { return parseInt(previousvalue, 10) + 1; });
  }
  else if(this.className == 'btn btn-outline-danger') {
    $('#' + playerid + ' div input').val(function(i, previousvalue) { return parseInt(previousvalue, 10) - 1; });
  }
});

/*
  CREATE PLAYERS
*/
$('#player-create').click(function() {
  $.each(JSON.parse(localStorage.pointkeeper), function(playerid, info) {
    updatePlayers(playerid, info);
  });
});

/*
  CLEAR PLAYERS
*/
$('#player-clear').click(function() {
  localStorage.pointkeeper = '';
  jsonstorage = {};
  location.reload();
});

/*
  SAVE GAME
*/
function saveGame() {
  localStorage.pointkeeper = JSON.stringify(jsonstorage);
}
