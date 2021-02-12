//Set Cookie
$('#projectCookieCreate').click(function() {
  var cookie_input = $('#projectCookie input').val();
  
  if(cookie_input != '') {
	document.cookie = 'projectcookie=' + cookie_input + ';';
    $('#projectCookieInput').html(document.cookie.substring(document.cookie.indexOf('=') + 1));
  }
  else {
    alert('Please provide some value to store in the cookie.');
  }
});

//Delete Cookie
$('#projectCookieDelete').click(function() {
  document.cookie = 'projectcookie=;';
  $('#projectCookieInput').html(document.cookie.substring(document.cookie.indexOf('=') + 1));
});
