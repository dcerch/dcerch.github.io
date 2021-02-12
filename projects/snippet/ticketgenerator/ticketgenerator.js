$.getScript('https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js')
  .done(function( script, textStatus ) {
    //console.log( textStatus );
    //createTicket();
  })
  .fail(function( jqxhr, settings, exception ) {
    console.log('Looks like you have encountered an error with the ticket generator: ' + jqxhr, settings, exception);
});

$('#ticketStage div div:first-child').hide();

$('#projectTicketGenerator div button').click(function() {
  createTicket();
});

function createTicket() {
  var qr = new QRious({
    element: document.getElementById('qr'),
    value: 'https://github.com/neocotic/qrious'
  });
  $('#ticketStage div div:first-child').fadeIn("slow");
}
