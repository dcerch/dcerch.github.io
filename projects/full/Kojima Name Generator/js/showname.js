//When the generate button is clicked, begin generating name and displaying results
$('#generate').click(function() {
  generateName();

  var name_results = '';

  name_results = name_results + '<h3 class="font-italic">Your True Kojima name is...</h3>';
  name_results = name_results + '<h1 class="display-3 mb-4">' + kojima_name[0] + '</h1>';

  //If alternate names need to be added
  if(kojima_name.length != 1) {
    name_results = name_results + '<h3 class="font-italic">with alternate names such as...</h3>';
    name_results = name_results + '<p class="mb-4">';
    for (i = 1; i < kojima_name.length; i++) {
      //If the last item is not being added, put a comma
      if(i != kojima_name.length - 1) {
        name_results = name_results + kojima_name[i] + ', ';
      }
      else {
        name_results = name_results + kojima_name[i];
      }
    }
    name_results = name_results + '</p>';
  }

  $('#resultsName').html(name_results);
  $('#resultsExplanation').html(kojima_name[0]);

  //Show results
  $('#sectionInformation').hide();
  $('#sectionResults').show();
});
