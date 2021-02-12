/*
Workflow demo purposes
*/

//Write the workflow demo to the bottom
document.write('<footer class="text-left border p-3"><h3>Workflow demonstration</h3><p class="lead">Use the buttons below for testing purposes</p><div class="row align-items-center"><div class="col-sm-auto mb-2"><button type="button" class="btn btn-outline-primary" id="workflowsignin">Sign into Fearless via phone</button></div><div class="col-sm-auto mb-2"><button type="button" class="btn btn-outline-primary" id="workflowverify">Verify sign in information</button></div><div class="col-sm-auto mb-2"><button type="button" class="btn btn-outline-primary" id="workflowwelcome">Welcome registered user</button></div><div class="col-sm-auto mb-2"><button type="button" class="btn btn-outline-primary" id="workflownew">Add new user to database</button></div></div></footer>');

//Sign In
$('#workflowsignin').click(function() {
  $('section').addClass('collapse');
  $('#signin').removeClass('collapse');
});

//Verify
$('#workflowverify').click(function() {
  $('section').addClass('collapse');
  $('#verify').removeClass('collapse');
});

//Welcome
$('#workflowwelcome').click(function() {
  $('section').addClass('collapse');
  $('#welcome').removeClass('collapse');
});

//Add
$('#workflownew').click(function() {
  $('section').addClass('collapse');
  $('#add').removeClass('collapse');
});
