//Javascript Random
//Set variables for values and runs
var run_time = 100;
var run_min = 1;
var run_max = 9999;

$('#projectRandomizer button').click(function() {
  var run_js = [];
  var run_my = [];
  
  //Run Randomizer
  for (i = 0; i < run_time; i++) {
	run_js.push(Math.floor(Math.random() * run_max) + run_min);
	run_my.push(getRandomNum());
  }
  
  //Display Results
  $('#projectRandomizerJS').text(JSON.stringify(run_js).replace(/\[|\]/gi, ''));
  $('#projectRandomizerMY').text(JSON.stringify(run_my).replace(/\[|\]/gi, ''));
});

//My Random Algorithm
function getRandomNum() {
  //Set my variable to return
  var my_num = 0;
  
  //Push random numbers into date method to create a random date
  var d = new Date((Math.floor(Math.random() * run_max) + run_min), (Math.floor(Math.random() * run_max) + run_min), (Math.floor(Math.random() * run_max) + run_min), (Math.floor(Math.random() * run_max) + run_min), (Math.floor(Math.random() * run_max) + run_min), (Math.floor(Math.random() * run_max) + run_min), (Math.floor(Math.random() * run_max) + run_min));
  my_num = Math.abs(d.getTime() * Math.PI);
  
  //Convert into a string, take the first number up until a random number between 1 and the max length of the run_max variable, then convert string number back to real number
  my_num = my_num.toString();
  my_num = my_num.substring(0,parseInt(Math.floor(Math.random() * run_max.toString().length) + 1));
  my_num = parseInt(my_num);
  
  return my_num;
}

//Listen for selected option to set approriate symbol
$('#projectRandomizer div select').change(function() {
  $('#randomizeroutput').html(set_randsym($(this).val()));
});