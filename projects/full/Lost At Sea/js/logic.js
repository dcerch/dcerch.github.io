//Set list to draggable
$('#latList').sortable();
$('#latList').disableSelection();

//Start the game
$('#latStart').click(function() {
  $('#latIntroduction').hide();
  $('#latGame').show();

  startTimer();
});

//View the results
$('#latFinish').click(function() {
  $('#latGame').hide();
  $('#latResults').show();
});

function startTimer() {
  var gameTimer = new easytimer.Timer();
  gameTimer.start({
    countdown: true,
    startValues: {seconds: 240},
  });

  $('#latTimer').html(gameTimer.getTimeValues().toString(['minutes', 'seconds']));

  gameTimer.addEventListener('secondsUpdated', function (e) {
    $('#latTimer').html(gameTimer.getTimeValues().toString(['minutes', 'seconds']));
  });

  gameTimer.addEventListener('targetAchieved', function (e) {
    //Disable list and add shade
    $('#latList').sortable('destroy');
    $('#latList li').removeClass('list-group-item-warning');
    $('#latList li').addClass('list-group-item-secondary');

    //Remove disabled button
    $('#latFinish').prop('disabled', false);

    //Evaluate results
    evaluateResults();
  });
}

function evaluateResults() {
  /*
    Worst case: 112 points
    Best case: 0 points
    0-45 rescue, 46+ no rescue
  */

  var playerCounter = 0;
  var playerItems = [];

  //Score variables
  var score = 0;
  var scorePercent = 0;
  const scoreMax = 112;
  const rescueThreshold = .6;

  //Update score
  $('#latList li').each(function(playerPriority, officalPriority) {
    //Get player priority and offical priority, take their absolute value and add them all together
    score += Math.abs(Number($(officalPriority).val()) - (Number(playerPriority)+1));
    playerItems.push($(officalPriority).text());
  });

  //Calculate score percentage
  var scorePercent = Math.abs((score / scoreMax) - 1).toFixed(2);

  //Display rescue message and chance
  if(scorePercent >= rescueThreshold) {
    $('#latRescue').append('<div class="alert alert-success text-center" role="alert"><h1 class="display-4">You survived!</h1><p class="lead text-center">You have about a ' + (scorePercent*100) + '% chance to be rescued.</p></div><hr>');
  }
  else {
    $('#latRescue').append('<div class="alert alert-danger text-center" role="alert"><h1 class="display-4">You did not survive.</h1><p class="lead text-center">You have about a ' + (scorePercent*100) + '% chance to be rescued.</p></div><hr>');
  }

  //Display comparsion table
  $.each(officialChoices, function(itemIndex, itemArray) {
    $('#latTable').append('<tr><th scope="row">' + itemArray['priority'] + '</th><td>' + playerItems[playerCounter] + '</td><td>' + itemArray['item'] + '</td><td>' + itemArray['justification'] + '</td></tr>');
    playerCounter++;
  });
}
