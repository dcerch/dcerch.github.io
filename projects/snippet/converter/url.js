function encodeURL() {
  var input = $('#converterinput').val();
  input = encodeURI(input);
  $('#converteroutput').html(input);
}
function decodeURL() {
  var input = $('#converterinput').val();
  input = decodeURI(input);
  $('#converteroutput').html(input);
}