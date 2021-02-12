/*
  Cryptocurrency - A tool for determining the gain/loss of your crypto investments as well as other external widgets.
  
  Currently known issues:
    1. 
*/

//Listen for manual transaction button to be clicked
$('#projectCrypto div div div div button').click(function() {
  var usd_price = $('#projectCrypto div div div input:nth-of-type(1)').val();
  var coin_amt = $('#projectCrypto div div div input:nth-of-type(2)').val();
  
  switch($(this).text()) {
    case 'BTC':
	  cryptonatorPrice('btc', usd_price, coin_amt);
	  break;
	case 'BCH':
	  cryptonatorPrice('bch', usd_price, coin_amt);
	  break;
	case 'ETH':
	  cryptonatorPrice('eth', usd_price, coin_amt);
	  break;
	case 'LTC':
	  cryptonatorPrice('ltc', usd_price, coin_amt);
	  break;
  }
  $('#projectCrypto div div div input').val('');
});

//Listen for model upload button to be clicked
function handleFileSelect(evt) {
  var file = evt.target.files[0];

  Papa.parse(file, {
    dynamicTyping: true,
    complete: function(results) {
	  for (i = 5; i < results.data.length - 1; i++) {
        var coin_type = results.data[i][3];
		var coin_amt = results.data[i][2];
		var usd_price = results.data[i][7];
		cryptonatorPrice(coin_type, usd_price, coin_amt);
      }
    }
  });
}

$(document).ready(function(){
  $("#projectCrypto div div div input[type=file]").change(handleFileSelect);
});

function cryptonatorPrice(coin_type, usd_price, coin_amt) {
  var cryptonator_url = 'https://api.cryptonator.com/api/ticker/' + coin_type + '-usd';
  var gain_loss;
  var total_gain_loss;
  
  $.getJSON(cryptonator_url, function(data) {
	//Current price times the amount of coins you have minus the initial investment you made
	gain_loss = (data.ticker.price * coin_amt) - usd_price;
	//Put transaction into table
    $('#projectCrypto div div div table').append('<tr><td>' + data.ticker.base + '</td><td>' + data.ticker.price + '</td><td>' + gain_loss + '</td></tr>');
	//Pull and parse current total and add recent transaction
    total_gain_loss = Number($('#projectCrypto div div div h6 b').text()) + gain_loss;
	//Display and format total
	$('#projectCrypto div div div h6').html('Total Gain Loss: $<b>' + total_gain_loss.toFixed(2) + '</b>');
  });
}

//Get a JSON object for each of the cryptos
/* JSON Object from Cryptonator
  console.log(data.timestamp);
  console.log(data.ticker.base);
  console.log(data.ticker.target);
  console.log(data.ticker.price);
  console.log(data.ticker.volume);
  console.log(data.ticker.change);
*/

//Listen to button clicks then replace with cryptonator widgets
$('#cryptonatorCalc').click(function() {
  window.location.href = 'https://www.cryptonator.com/widget/view/?q=&s=calc';
});
$('#cryptonatorPrice').click(function() {
  window.location.href = 'https://www.cryptonator.com/widget/view/?q=%0Acrypt_multi_num_cur%20%3D%20%223%22%3B%0Acrypt_base_cur_0%20%3D%20%22Bitcoin%20(BTC)%22%3Bcrypt_target_cur_0%20%3D%20%22US%20Dollar%20(USD)%22%3Bcrypt_base_cur_1%20%3D%20%22Ethereum%20(ETH)%22%3Bcrypt_target_cur_1%20%3D%20%22US%20Dollar%20(USD)%22%3Bcrypt_base_cur_2%20%3D%20%22Litecoin%20(LTC)%22%3Bcrypt_target_cur_2%20%3D%20%22US%20Dollar%20(USD)%22%3B&s=multi';
});