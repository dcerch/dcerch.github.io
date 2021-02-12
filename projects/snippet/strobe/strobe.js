//Listen for strobe button click, change text and set strobe
$('#projectStrobe button').click(function() {
  if($(this).text() == 'Start Strobe') {
    $(this).text('Stop Strobe');
	handle = window.setInterval(strobe, 110);
  }
  else {
    $(this).text('Start Strobe');
	clearInterval(handle);
	$('#strobediv').css('background-color','#ffffff');
  }
});

function strobe() {
	var color1 = Math.floor((Math.random() * 255) + 1);
	var color2 = Math.floor((Math.random() * 255) + 1);
	var color3 = Math.floor((Math.random() * 255) + 1);

	var randcolor = "rgb(" + color1 + "," + color2 + "," + color3 + ")";
	$('#strobediv').css('background-color', randcolor);
}
