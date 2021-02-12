//Declare variables
var emailTo = '';
var emailCc = '';
var emailBcc = '';
var emailSubject = '';
var emailBody = '';
var emailURL = '';
var emailHTML = '';

$('#projectMailTo div button').click(function() {
  //Set variables to user input
  emailTo = $('#mailto_to').val();
  emailCc = $('#mailto_cc').val();
  emailBcc = $('#mailto_bcc').val();
  emailSubject = encodeURIComponent($('#mailto_subject').val());
  emailBody = encodeURIComponent($('#mailto_body').val());
  
  //Do simple validation for empty string
  if(emailTo != '') {
	//Stitch email string together
	emailURL = 'mailto:' + emailTo + '?CC=' + emailCc + '&BCC=' + emailBcc + '&Subject=' + emailSubject + '&Body=' + emailBody;
	emailHTML = '<a href="' + emailURL + '"></a>';
	
	//Insert MailTo information then display
    $('#projectMailTo div .collapse div div div input').val(emailHTML);
    $('#projectMailTo div .collapse div a').attr("href", emailURL)
    $('#projectMailTo div .collapse').slideDown();
  }
  else {
	alert('Please provide email address(es) in the "TO" input field.');
  }
});

$('#projectMailTo div .collapse div div div div button').click(function() {
  $('#projectMailTo div .collapse div div div input').select();
  document.execCommand("Copy");
});