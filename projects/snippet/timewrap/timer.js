var timer = new Timer();

var timerHTML = `
<article class="border border-info d-sm-flex justify-content-between mb-3">
  <input class="form-control m-2" type="text" placeholder="Timer Label">
  <select class="custom-select m-2">
    <option selected disabled>Labor Category</option>
    <option disabled>Overhead</option>
    <option value="o1">Premier - Presales Activity</option>
    <option value="o2">General Administration</option>
    <option value="o3">Meetings & Events</option>
    <option value="o4">Mentor / Community / Non-Sanctioned IP Dev / Practice Contribution</option>
    <option value="o5">New Hire Training</option>
    <option value="o6">Premier Proactive Offerings Accreditation</option>
    <option value="o7">Training Taken</option>
    <option value="o8">Standy / Bench Time</option>
    <option value="o9">Time Away</option>
    <option value="o10">Travel - Non-Util</option>
    <option disabled><b>Client Billable</b></option>
    <option value="c1">Service Delivery Management</option>
    <option value="c2">Reactive Service Management</option>
    <option value="c3">Cloud Consumption Management</option>
    <option value="c4">Advisory Services</option>
    <option value="c5">Travel (Non-Billable)</option>
    <option value="c6">Travel (Billable)</option>
  </select>
  <input class="form-control timerInput m-2" type="text" placeholder="HH:MM:SS" readonly>
  <a href="javascript:void(0)" class="align-self-center startTimer m-2" title="Start Timer"><i class="material-icons md-36">timer</i></a>
  <a href="javascript:void(0)" class="align-self-center pauseTimer m-2 collapse" title="Pause Timer"><i class="material-icons md-36">timer_off</i></a>
</article>
`;

//Control timers
//Note: Need to use on event handler for proper event delegation

//Start
$('#sectionTimer').on('click', '.startTimer', function() {
  timer.start();
  //Hide this, show pause
  $(this).hide();
  $(this).siblings('.pauseTimer').show();
});

//Pause
$('#sectionTimer').on('click', '.pauseTimer', function() {
  timer.pause();
  //Hide this, show start
  $(this).hide();
  $(this).siblings('.startTimer').show();
});

//Update timer displays
timer.addEventListener('secondsUpdated', function (e) {
  $('.timerInput').val(timer.getTimeValues().toString());
  $('#sectionTotal h3 b').text(timer.getTimeValues().toString());
});
timer.addEventListener('started', function (e) {
  $('.timerInput').val(timer.getTimeValues().toString());
});
timer.addEventListener('reset', function (e) {
  $('.timerInput').val(timer.getTimeValues().toString());
});

//Logic for adding timer
$('#sectionCreate button').click(function () {
  $('#sectionTimer').append(timerHTML);
});

//Logic for totaling timers
$('article .timerInput').each(function(index) {
  //Add
});
