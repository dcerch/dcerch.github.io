//Initalize button list of adventures
$.each(adventures, function(key, adventure) {
  $('#adventurelist').append('<button type="button" class="list-group-item list-group-item-info list-group-item-action flex-fill">' + adventure.title + '</button>');
});

//Listen for button list of adventures to start display function
$('#adventurelist button').click(function() {
  var clickedadventure = $(this).html();

  $.each(adventures, function(key, adventure) {
    if(clickedadventure == adventure.title) {
      displayadventure(adventure);
    }
  });
});

function displayadventure(adventure) {
  console.log(adventure);

  $('#title').html(adventure.title);
  $('#description').html(adventure.description);
  $('#backstory').html(adventure.backstory);

  //First reset each section's information
  $('#areas').html('<article class="card-columns"></article>');
  $('#characters').html('<article class="row row-cols-1 row-cols-md-3"></article>');
  $('#items').html('<article class="card-columns"></article>');
  var areacards = '';
  var charactercards = '';
  var itemcards = '';

  //Loop through all information in areas, characters and items
  $.each(adventure.areas, function(key, areas) {
    areacards =
      '<div class="card">' +
        '<div class="card-body text-center">' +
          '<h5 class="card-title">' + areas.name + '</h5>' +
          '<h6 class="card-subtitle text-muted mb-3">Adventure sequence ' + key + '</h6>' +
          '<a href="' + areas.img + '" class="btn btn-outline-primary btn-block btn-sm" target="_blank">Area Model</a>' +
          '<p class="card-text">' + areas.description + '</p>' +
        '</div>' +
      '</div>';

    $('#areas article').append(areacards);
  });

  $.each(adventure.characters, function(key, characters) {
    charactercards =
    '<div class="col mb-3">' +
      '<div class="card">' +
        '<div class="card-body text-center">' +
          '<h5 class="card-title">' + characters.name + '</h5>' +
          '<h6 class="card-subtitle text-muted mb-3">Level ' + characters.level + ' ' + characters.alignment + ' ' + characters.race + '</h6>' +
          '<a href="' + characters.img + '" class="btn btn-outline-primary btn-block btn-sm" target="_blank">Character Model</a>' +
          '<p><small class="card-text">' + characters.description + '</small></p>' +
          '<button class="btn btn-info btn-block btn-sm mb-3" type="button" data-toggle="collapse" data-target="#character' + key + '">Attributes/Abilities</button>' +
          '<div class="collapse" id="character' + key + '">' +
            '<h3 class="mb-3">Attributes</h3>' +
            '<div class="d-flex justify-content-between">' +
              '<p class="font-weight-bold">Health: ' + characters.health + '</p>' +
              '<p class="font-weight-bold">Armor: ' + characters.armor + '</p>' +
              '<p class="font-weight-bold">Speed: ' + characters.speed + '</p>' +
            '</div>' +
            '<ul class="list-group list-group-flush mb-3">' +
              '<li class="list-group-item">Strength: ' + characters.strength + '</li>' +
              '<li class="list-group-item">Dexterity: ' + characters.dexterity + '</li>' +
              '<li class="list-group-item">Constitution: ' + characters.constitution + '</li>' +
              '<li class="list-group-item">Intelligence: ' + characters.intelligence + '</li>' +
              '<li class="list-group-item">Wisdom: ' + characters.wisdom + '</li>' +
              '<li class="list-group-item">Charisma: ' + characters.charisma + '</li>' +
            '</ul>' +
            '<h3>Abilities</h3>' +
            '<ul class="list-group list-group-flush">' + characters.abilities + '</ul>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';

    $('#characters article').append(charactercards);
  });

  $.each(adventure.items, function(key, items) {
    itemcards =
    '<div class="card">' +
      '<div class="card-body text-center">' +
        '<h5 class="card-title">' + items.name + '</h5>' +
        '<h6 class="card-subtitle text-muted mb-3">Costs ' + items.cost + ' currency</h6>' +
        '<a href="' + items.img + '" class="btn btn-outline-primary btn-block btn-sm" target="_blank">Item Model</a>' +
        '<p class="card-text">' + items.description + '</p>' +
      '</div>' +
    '</div>';

    $('#items article').append(itemcards);
  });

  //Display section
  $('#adventuresection').show();
}
