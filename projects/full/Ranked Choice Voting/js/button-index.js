//Create poll and redirect to sharing
$('#rcvPollCreate').click(function() {
  //Set variables for Firebase JSON object
  var pollName = '';
  var pollChoices = [];

  //Set poll name
  pollName = $('#rcvPollName').val();

  //Get each choice and add them to an array
  $('#rcvPollChoices input').each(function(index) {
    //Only add non-empty names
    if($(this).val() != '') {
      pollChoices.push($(this).val());
    }
  });

  //Create poll and redirect to sharing screen
  window.location.replace('./sharing.html?rcvID=' + createPoll(pollName, pollChoices));
});

//Get ID input and redirect to vote
$('#rcvPollVote').click(function() {
  //Get RCV ID
  const rcvID = $('#rcvPollID').val();
  //Grab user input and redirect to sharing screen
  window.location.replace('./vote.html?rcvID=' + rcvID);
});

//Get ID input and redirect to results
$('#rcvPollResults').click(function() {
  //Get RCV ID
  const rcvID = $('#rcvPollID').val();
  //Grab user input and redirect to sharing screen
  window.location.replace('./results.html?rcvID=' + rcvID);
});
