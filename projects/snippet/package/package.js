recentTracking();

function trackPackage(carrier) {
var trackingnumber = document.getElementById('trackingnumber').value;

//Check for localStorage functionality
if (typeof(Storage) !== "undefined") {
  //Check if there is already one item in the tracking numbers list and add the new tracking number to the list.
  if(localStorage.getItem('trackinglist') !== null) {
    var storedtracking = JSON.parse(localStorage.getItem('trackinglist'));
	storedtracking.push(trackingnumber);
	localStorage.setItem('trackinglist', JSON.stringify(storedtracking));
  }
  else {
    localStorage.setItem('trackinglist', '["' + trackingnumber + '"]');
  }
} else {
  alert('Your browser does not support local storage. Please upgrade your browser to use this site\'s functionality.');
}

//Build and display relevant carrier websites
switch(carrier) {
  case 'ups':
	window.open('https://wwwapps.ups.com/WebTracking/track?track=yes&trackNums=' + trackingnumber,'_blank');
    break;
  case 'fedex':
	window.open('https://www.fedex.com/apps/fedextrack/?tracknumbers=' + trackingnumber,'_blank');
    break;
  case 'usps':
	window.open('https://tools.usps.com/go/TrackConfirmAction?tLabels=' + trackingnumber,'_blank');
    break;
  case 'dhl':
	window.open('http://www.dhl.com/en/express/tracking.html?AWB=' + trackingnumber,'_blank');
    break;
  default:
	alert('Cannot find carrier');
}

recentTracking();
}

function recentTracking() {
  //Build and display recent tracking numbers
  var trackingarray;
  var recentlist = '';

  if(JSON.parse(localStorage.getItem('trackinglist')) != null) {
    trackingarray = JSON.parse(localStorage.getItem('trackinglist'));

    for(i=0; i < trackingarray.length; i++) {
      recentlist += '<a href="#" onclick="addTracking(' + trackingarray[i] + ')" class="list-group-item list-group-item-action">' + trackingarray[i] + '</a>';
    }
    document.getElementById('trackingarea').innerHTML = recentlist;
  }
}

function addTracking(recentnumber) {
  document.getElementById('trackingnumber').value = recentnumber;
}

function clearTracking() {
  localStorage.clear();
  document.getElementById('trackingarea').innerHTML = '';
}