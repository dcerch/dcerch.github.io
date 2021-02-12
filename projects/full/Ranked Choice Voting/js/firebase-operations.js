//Firebase pointer to DB
var database = firebase.database();

//Create new RCV poll
function createPoll(pollName, pollChoices) {
  //Create unique RCVID
  var rcvID = database.ref().push();
  //Set poll information
  rcvID.set({
    pollName: pollName,
    pollChoices: pollChoices
  });

  return rcvID.getKey();
}

//Add vote to RCV poll
function addVote(rcvID, pollVotes) {
  database.ref(rcvID + '/pollVotes').push(pollVotes);
}

//View current RCV poll
function viewPoll(rcvID) {
  database.ref(rcvID).on('value', function(snapshot) {
    console.log(snapshot.val());
  });
}
