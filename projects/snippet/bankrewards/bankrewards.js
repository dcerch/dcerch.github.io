//Bank array -- each array is a redemption method for a particular bank
//Note: if the structure of the array is changed, update the variables so they map correctly
var banks = [
  ['Chase', 'Cash Back', '.01', 'Third-party gift cards are also 1 cent per point.'],
  ['Chase', 'Ultimate Rewards Travel Redemptions', '.01', 'Plane tickets, hotel stays, rental cars or experiences'],
  ['Chase', 'Transfer to Travel Partners', '.01', 'Notes'],
  ['BoA', 'Travel BoA', '.02', 'BoA Notes']
];

const banktable = document.getElementById('bankTable');

//Variables mapped to each key in the bank array
var array_bank = 0;
var array_redemption = 1;
var array_value = 2;
var array_notes = 3;

//Variable of the cell that holds the total point value
var cell_value = 2;
var cell_total = 3;

//Update rewards table when input changes
$('#bankPoints').change(function() {
  var bankpoints = parseFloat($('#bankPoints').val());
  updateBanks(bankpoints);
});

//Add bank rewards table
function addBanks() {
  $.each(banks, function(key, value) {
	var bankrow = banktable.insertRow(-1);
	bankrow.insertCell(-1).innerHTML = value[array_bank];
	bankrow.insertCell(-1).innerHTML = value[array_redemption];
	bankrow.insertCell(-1).innerHTML = value[array_value];
	bankrow.insertCell(-1).innerHTML = 0;
	bankrow.insertCell(-1).innerHTML = value[array_notes];
  });
}

//Update bank rewards table
function updateBanks(points) {
  var bankrows = banktable.rows.length;
  var currentrow = 1;
  
  while(currentrow < bankrows) {
	//Parse the redemption method and preferred member values and add them together
	var totalvalue = parseFloat(banktable.rows[currentrow].cells[cell_value].innerHTML) + parseFloat($('#bankMember option:selected').val());
	
	//Update the total point value cell
	banktable.rows[currentrow].cells[cell_total].innerHTML = '$' + (totalvalue*points).toFixed(2);
	
	//Move to the next row
	currentrow++;
  }
}

//Build initial table
addBanks();