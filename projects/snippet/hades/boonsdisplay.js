var id_attack = document.getElementById('attack');
var id_special = document.getElementById('special');
var id_cast = document.getElementById('cast');
var id_dash = document.getElementById('dash');
var id_call = document.getElementById('call');
var id_other = document.getElementById('other');
var id_legendary = document.getElementById('legendary');
var id_duo = document.getElementById('duo');

var boonhtml_start = '<td><div class="boon border border-2 rounded text-center lh-sm p-2" onclick="this.classList.toggle(\'border-primary\');">';
var boonhtml_middle = '';
var boonhtml_end = '</div></td>';

//Attack
boons.attack.forEach(function(obj, ind, arr) {
  boonhtml_middle = '<img src="' + arr[ind].image + '" width="50" height="50"><br>';
  boonhtml_middle += '<b>' + arr[ind].name + '</b><br>';
  boonhtml_middle += '<small>' + arr[ind].description + '</small>';

  id_attack.insertAdjacentHTML('afterend', boonhtml_start + boonhtml_middle + boonhtml_end);
});

//Special
boons.special.forEach(function(obj, ind, arr) {
  boonhtml_middle = '<img src="' + arr[ind].image + '" width="50" height="50"><br>';
  boonhtml_middle += '<b>' + arr[ind].name + '</b><br>';
  boonhtml_middle += '<small>' + arr[ind].description + '</small>';

  id_special.insertAdjacentHTML('afterend', boonhtml_start + boonhtml_middle + boonhtml_end);
});

//Cast
boons.cast.forEach(function(obj, ind, arr) {
  boonhtml_middle = '<img src="' + arr[ind].image + '" width="50" height="50"><br>';
  boonhtml_middle += '<b>' + arr[ind].name + '</b><br>';
  boonhtml_middle += '<small>' + arr[ind].description + '</small>';

  id_cast.insertAdjacentHTML('afterend', boonhtml_start + boonhtml_middle + boonhtml_end);
});

//Dash
boons.dash.forEach(function(obj, ind, arr) {
  boonhtml_middle = '<img src="' + arr[ind].image + '" width="50" height="50"><br>';
  boonhtml_middle += '<b>' + arr[ind].name + '</b><br>';
  boonhtml_middle += '<small>' + arr[ind].description + '</small>';

  id_dash.insertAdjacentHTML('afterend', boonhtml_start + boonhtml_middle + boonhtml_end);
});

//Call
boons.call.forEach(function(obj, ind, arr) {
  boonhtml_middle = '<img src="' + arr[ind].image + '" width="50" height="50"><br>';
  boonhtml_middle += '<b>' + arr[ind].name + '</b><br>';
  boonhtml_middle += '<small>' + arr[ind].description + '</small>';

  id_call.insertAdjacentHTML('afterend', boonhtml_start + boonhtml_middle + boonhtml_end);
});

//Other
boons.other.forEach(function(obj, ind, arr) {
  boonhtml_middle = '<img src="' + arr[ind].image + '" width="50" height="50"><br>';
  boonhtml_middle += '<b>' + arr[ind].name + '</b><br>';
  boonhtml_middle += '<small>' + arr[ind].description + '</small>';

  id_other.insertAdjacentHTML('afterend', boonhtml_start + boonhtml_middle + boonhtml_end);
});

//Legendary
boons.legendary.forEach(function(obj, ind, arr) {
  boonhtml_middle = '<img src="' + arr[ind].image + '" width="50" height="50"><br>';
  boonhtml_middle += '<b>' + arr[ind].name + '</b><br>';
  boonhtml_middle += '<small>' + arr[ind].description + '</small>';

  id_legendary.insertAdjacentHTML('afterend', boonhtml_start + boonhtml_middle + boonhtml_end);
});

//Duo
boons.duo.forEach(function(obj, ind, arr) {
  boonhtml_middle = '<img src="' + arr[ind].image + '" width="50" height="50"><br>';
  boonhtml_middle += '<b>' + arr[ind].name + '</b><br>';
  boonhtml_middle += '<small>' + arr[ind].description + '</small>';

  id_duo.insertAdjacentHTML('afterend', boonhtml_start + boonhtml_middle + boonhtml_end);
});

/*
var boonhtml = '';

document.write(boonhtml);

<div class="boon border border-2 rounded text-center p-2" onclick="this.classList.toggle('border-primary');">
  <img src="https://static.wikia.nocookie.net/hades_gamepedia_en/images/e/e6/Divine_Strike.png/revision/latest?cb=20181213194033" width="50" height="50">
  <br>
  <b>Divine Strike</b>
  <br>
  <small>Your Attack is stronger, and can Deflect.</small>
</div>
*/
