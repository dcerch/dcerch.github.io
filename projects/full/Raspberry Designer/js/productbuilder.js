//Choose RPI
$('#rpiChoice a').click(function() {
  switch($(this).attr('href')) {
    case '#rpi0':
      buildProducts('rpi0');
      break;
    case '#rpi3':
      buildProducts('rpi3');
      break;
    case '#rpi4':
      buildProducts('rpi4');
      break;
  }
});

//Build product cards
function buildProducts(rpi) {
  var htmlProductFamily = '';
  var htmlProduct = '';

  //Loop through product family
  $.each(products[rpi], function(masterIndex, masterProducts) {
    //Append carousel item with correct title, keeping in mind the need for the active class
    if(masterIndex !== 'Case') {
      htmlProductFamily += '<div class="carousel-item"><h1 class="display-3 text-light text-center mb-4">';
      htmlProductFamily += masterIndex;
      htmlProductFamily += '</h1><div class="card-columns">';
    }
    else {
      htmlProductFamily = '<div class="carousel-item active"><h1 class="display-3 text-light text-center mb-4">';
      htmlProductFamily += masterIndex;
      htmlProductFamily += '</h1><div class="card-columns">';
    }

    //Append all products
    $.each(masterProducts, function(index, productInfo) {
      htmlProduct += '<div class="card text-white bg-dark"><img src="';
      htmlProduct += productInfo['image'];
      htmlProduct += '" class="card-img-top"><div class="card-body"><h5 class="card-title">';
      htmlProduct += productInfo['title'];
      htmlProduct += '</h5><a class="btn btn-primary btn-sm" target="_blank" role="button" href="';
      htmlProduct += productInfo['purchase'];
      htmlProduct += '">$';
      htmlProduct += productInfo['price'];
      htmlProduct += ' on Amazon</a></div></div>';
    });

    //Append one product family with multiple products and close product family
    $('#productCarousel').append(htmlProductFamily + htmlProduct + '</div></div>');

    //Clear out both variables for next round
    htmlProductFamily = '';
    htmlProduct = '';
  });

  //Hide Jumbtron and show main products
  $("#RPIJumbtron").hide();
  $("#productDisplay").show();
}
