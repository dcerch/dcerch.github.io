//Assign array of movies for draft
//Notes: Start with the draftee's name following n number of movie IDs they drafted
var movie_draft = [
  ['Dom', 'untitledhansolostarwarsanthologyfilm', 'sorrytobotheryou', 'hoteltransylvania3', 'mammamia2', 'thespywhodumpedme', 'replicas'],
  ['Jiaren', 'foxmarvel18', 'ant-manandthewasp'],
  ['Michelle', 'theincredibles2', 'crazyrichasians'],
  ['Rob', 'upgrade', 'a24horrora', 'wbeventfilm2018c', 'uncledrew', 'purge4'],
  ['Sasi', 'marvel0518'],
  ['Steve', 'jurassicworldsequel', 'sicario2', 'skyscraper', 'missionimpossible6', 'slenderman']
];

//Build box office url for getting gross revenue
//Notes: CORS Acceptance URL needed
const cors = 'https://cors-anywhere.herokuapp.com/';
const box_mojo = 'http://www.boxofficemojo.com/data/js/moviegross.php?id=';
const cors_box = cors + box_mojo;

const re_box_mojo_gross = /mojo_row><b>([^<]+)</;
const re_box_mojo_name = /mojo_header>([^<]+)</i;
const re_comma = /\B(?=(\d{3})+(?!\d))/g;

var box_office_url = '';

function addToTotal(consist, gross_post) {
  //Parse to get total
  var total = $('#movieCard' + consist + ' .card-footer b').text();
  var running_total = parseInt(total.replace(/(\$|,)/g, ''));

  //Check if running total is a number
  if(isNaN(running_total)) {
    running_total = 0;
  }

  //Add running total with the new gross revenue movie
  running_total = running_total + gross_post;

  //Overwrite footer with updated totals
  $('#movieCard' + consist + ' .card-footer').html('Total <b class="float-right">$' + running_total.toString().replace(re_comma, ',') + '</b>');
}

//Overall disclaimer and last updated
var d = new Date();
d.setDate(d.getDate() - 1);
$('#projectMovieDraft div small').html('Note: Domestic gross revenue only. Zero revenue movies mean their statistics have not yet been posted. Last Updated: ' + d.toLocaleDateString('en-US'));

//Perform calls
$.each(movie_draft, function(key, value) {
  //Write the card header with the draftee's name and zero out new draftee's box office gross total amount
  $('#movieCards').append('<div class="card" id=movieCard' + key + '><div class="card-body"><h3 class="card-title">' + value[0] + '\'s Movie Draft Pick(s)</h3></div><ul class="list-group list-group-flush"></ul><div class="card-footer text-muted"></div></div>');

  //Go throw each movie ID, build the URL, retrieve it via AJAX then append it to the list
  for(i = 1; i < movie_draft[key].length; i++) {
    //Build the URL that will pull the movie data
  box_office_url = cors_box + value[i] + '.htm';

  //Send the URL to pull movie data
  $.get(box_office_url, function(data) {
      //Find just the gross revenue value and movie name
    var gross = re_box_mojo_gross.exec(data)[1];
    var movie_name = re_box_mojo_name.exec(data)[1];
	var gross_post = 0;
    var consist = key;

    //Remove extra characters from gross revenue and convert it to a number then check if it is gross revenue or 'in theaters'
    gross_post = parseInt(gross.replace(/(\$|,)/g, ''));
    if(isNaN(gross_post)) {
      gross_post = 0;
    }

    //Add movie name and gross revenue to list as well as update total
    $('#movieCard' + consist + ' ul').append('<li class="list-group-item">' + movie_name + '<i class="float-right"> $' + gross_post.toString().replace(re_comma, ',') + '</i></li>');
      addToTotal(consist, gross_post);
    });
  }
});
