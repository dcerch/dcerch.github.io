//Return the URL parameters
function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
      vars[key] = value;
  });
  return vars;
}

//Check URL for plan ID and guide user appropriately
function checkURL() {
  //Get URL parameters and match if it is planID
  if(getUrlVars()['planID'] != undefined) {
    //Show participant section then hide default event
    $('#section-participant').show();
    $('#section-default').hide();

    const planID = getUrlVars()['planID'];
    const link = window.location.href;

    //Use planID to match FB DB
    planRef.child(planID).once('value').then(function(snapshot) {
      //Set all variables
      const event = snapshot.child('event').val();
      const cost = snapshot.child('cost').val();
      const category = snapshot.child('category').val();
      const participants = snapshot.child('participants').val();

      //Display all information
      $('#participant-output-event').text(event);
      $('#participant-output-cost').text('$' + cost);
      $('#participant-output-category').text(category);
      $('#participant-output-link').attr('href', link);
      $('#participant-output-id').text(planID);
      $.each(participants, function(key, value) {
        $('#participant-input-name').append('<option>' + value + '</option>');
      });
    });
  }
  else {
    //Show host or view event then hide participant event
    $('#section-participant').hide();
    $('#section-default').show();
  }
}

//Start the check
checkURL();
