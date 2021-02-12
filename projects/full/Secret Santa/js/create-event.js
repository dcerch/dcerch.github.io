//Create event in FB
function createEvent(event, cost, category, participants, matches) {
  // Get a reference to the database service
  var userRef = planRef.push();

  // Set new plan to newly created plan ID along with profile information
  userRef.set({
    'event': event,
    'cost': cost,
    'category': category,
    'participants': participants,
    'matches': matches
  });

  //Store Plan ID in localstorage
  storePlanID(userRef.key);
}

//Store plan ID locally
function storePlanID(planID) {
  // Determine if browser supports localstorage
  if (typeof(Storage) !== 'undefined') {
    // If supported
    localStorage.planID = planID;
  } else {
    // If not supported
    alert('Your browser does not support local storage, which this website uses to store your data locally for easy retrieval. Please upgrade to a modern browser.');
  }
}

//Shuffle and return an array using ES6
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

//Submit new event
$('#create-submit').click(function() {
  var event = $('#create-input-event').val();
  var cost = $('#create-input-cost').val();
  var category = $('#create-input-category').val();
  var participants = [];
  var matches = [];

  //Get all non-empty participants and push to array
  $('.create-input-participant').each(function(index) {
    //Only add non-empty names
    if($(this).val() != '') {
      participants.push($(this).val());
    }
  });

  //Create new array of scrambled participant list
  var participantsScrambled = shuffle(participants.slice());

  //Assign each participant to a shuffled match
  $.each(participants, function(index, value) {
    //If the participant name is not equal to the first position of the scrambled participant list, assign participant name as the key and either the first or last item as the value
    if(value != participantsScrambled[0]) {
      matches[value] = participantsScrambled.shift();
    }
    else {
      matches[value] = participantsScrambled.pop();
    }
  });

  //Submit user input into Firebase and grab push ID
  createEvent(event, cost, category, participants, matches);

  //Display the sharing output for URL
  $('#host-output-url').val(window.location.href + '?planID=' + localStorage.planID);
  //Display the sharing output for ID
  $('#host-output-id').val(localStorage.planID);

  //Display plan ID with URL to share with others
  $('#section-default').hide();
  $('#section-host').show();
});
