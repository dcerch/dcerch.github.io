//Submit view participant form
$('#view-submit').click(function() {
  //Grab user input and redirect
  window.location.href = window.location.href + '?planID=' + $('#view-input-id').val();
});

//Submit participant form
$('#participant-submit').click(function() {
  //Set plan ID based on URL parameter
  const giveName = $('#participant-input-name option:selected').val();
  const planID = getUrlVars()['planID'];
  var receiveName = '';

  //Use planID to match FB DB
  planRef.child(planID).once('value').then(function(snapshot) {
    //Set all variables
    const matches = snapshot.child('matches').val();

    //Set the receive name when it matches then user selected name
    $.each(matches, function(key, value) {
      //If the key of the matches equals the user selected name, set the receive name as the value of that match
      if(key == giveName) {
        receiveName = value;
      }
    });

    //Display the receiving name
    $('#participant-output-name').text(receiveName);
  });

  //Hide other backdrop displays and show Participant Gift Name modal
  $('#article-participant-input').hide();
  $('#article-participant-output').show();
});

//Add new participant input
$('#add-input-participant').click(function() {
  $('#create-input-participant').append('<div class="col-sm-4"><input type="text" class="form-control create-input-participant mb-2" placeholder="Participant Name"></div>');
});
