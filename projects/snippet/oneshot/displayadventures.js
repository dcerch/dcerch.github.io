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
  $('#areas').html('<article class="row"></article>');
  $('#characters').html('<article class="row"></article>');
  $('#items').html('<article class="row"></article>');
  var areacards = '';
  var charactercards = '';
  var itemcards = '';

  //Loop through all information in areas, characters and items
  $.each(adventure.areas, function(key, areas) {
    //Start and reset area card
    areacards = '<div class="col-xl-2 col-lg-4 col-md-6 col-sm-12 mb-4"><div class="card h-100"><div class="card-body text-center">';

    //Name
    if(areas.name != '') { areacards += '<h5 class="card-title">' + areas.name + '</h5>'; }

    //Adventure sequence
    areacards += '<h6 class="card-subtitle text-muted mb-3">Adventure sequence ' + key + '</h6>';

    //Image, description
    if(areas.img != '') { areacards += '<a href="' + areas.img + '" class="btn btn-outline-primary btn-block btn-sm" target="_blank">Area Model</a>'; }
    if(areas.description != '') { areacards += '<p class="card-text mt-2">' + areas.description + '</p>'; }

    //End area card
    areacards += '</div></div></div>';

    $('#areas article').append(areacards);
  });

  $.each(adventure.characters, function(key, characters) {
    //Start and reset character card
    charactercards = '<div class="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4"><div class="card h-100"><div class="card-body text-center">';

    //Name, level, image, description
    if(characters.name != '') { charactercards += '<h5 class="card-title">' + characters.name + '</h5>'; }
    if(characters.level != '' || characters.alignment != '' || characters.race != '') { charactercards += '<h6 class="card-subtitle text-muted mb-3">Level ' + characters.level + ' ' + characters.alignment + ' ' + characters.race + '</h6>'; }
    if(characters.img != '') { charactercards += '<a href="' + characters.img + '" class="btn btn-outline-primary btn-block btn-sm" target="_blank">Character Model</a>'; }
    if(characters.description != '') { charactercards += '<p><small class="card-text">' + characters.description + '</small></p>'; }

    //Attribute/abilities button
    charactercards += '<button class="btn btn-info btn-block btn-sm mb-3" type="button" data-toggle="collapse" data-target="#character' + key + '">Attributes/Abilities</button><div class="collapse" id="character' + key + '"><h3 class="mb-3">Attributes</h3><div class="d-flex justify-content-between">';

    //Health, armor, speed
    if(characters.health != '') { charactercards += '<p class="font-weight-bold">Health: ' + characters.health + '</p>'; }
    if(characters.armor != '') { charactercards += '<p class="font-weight-bold">Armor: ' + characters.armor + '</p>'; }
    if(characters.speed != '') { charactercards += '<p class="font-weight-bold">Speed: ' + characters.speed + '</p>'; }

    //Start attribute list
    charactercards += '</div><ul class="list-group list-group-flush mb-3">';

    //Strength, Dexterity, Constitution, Intelligence, Wisdom, Charisma
    if(characters.strength != '') { charactercards += '<li class="list-group-item">Strength: ' + characters.strength + '</li>'; }
    if(characters.dexterity != '') { charactercards += '<li class="list-group-item">Dexterity: ' + characters.dexterity + '</li>'; }
    if(characters.constitution != '') { charactercards += '<li class="list-group-item">Constitution: ' + characters.constitution + '</li>'; }
    if(characters.intelligence != '') { charactercards += '<li class="list-group-item">Intelligence: ' + characters.intelligence + '</li>'; }
    if(characters.wisdom != '') { charactercards += '<li class="list-group-item">Wisdom: ' + characters.wisdom + '</li>'; }
    if(characters.charisma != '') { charactercards += '<li class="list-group-item">Charisma: ' + characters.charisma + '</li>'; }

    //End attribute list
    charactercards += '</ul>';

    if(characters.abilities != '') { charactercards += '<h3>Abilities</h3><ul class="list-group list-group-flush">' + characters.abilities + '</ul>'; }

    //End character card
    charactercards += '</div></div></div></div>';

    $('#characters article').append(charactercards);
  });

  $.each(adventure.items, function(key, items) {
    //Start and reset item card
    itemcards = '<div class="col-xl-2 col-lg-4 col-md-6 col-sm-12 mb-4"><div class="card h-100"><div class="card-body text-center">';

    //Name, cost, image, description
    if(items.name != '') { itemcards += '<h5 class="card-title">' + items.name + '</h5>'; }
    if(items.cost != '') { itemcards += '<h6 class="card-subtitle text-muted mb-3">Costs ' + items.cost + ' currency</h6>'; }
    if(items.img != '') { itemcards += '<a href="' + items.img + '" class="btn btn-outline-primary btn-block btn-sm" target="_blank">Item Model</a>'; }
    if(items.description != '') { itemcards += '<p class="card-text">' + items.description + '</p>'; }

    //End item card
    itemcards += '</div></div></div>';

    $('#items article').append(itemcards);
  });

  //Display section
  $('#adventuresection').show();
}
