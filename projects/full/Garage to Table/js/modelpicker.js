//Create model cards and details when page loads
window.onload = function() {
  /*
  CAROUSEL STEP 2
  */

  var modelviewer = document.getElementById("modelpicker");

  //Iterate through models and add them as cards
  Object.entries(modelsobject["models"]).forEach(
    ([key, value]) => {
      var cardbuilder = '<div class="col"><div class="card">';
      cardbuilder += '<img src="' + value["img"] + '" class="card-img-top p-2">';
      cardbuilder += '<div class="card-body"><h5 class="card-title">' + value["title"] + '</h5>';
      cardbuilder += '<p class="card-text">' + value["description"] + '</p>';
      cardbuilder += '<a href="#" class="btn btn-primary modelbutton" data-bs-target="#carouselExampleIndicators" data-bs-slide="next" data-modelid="' + key + '">Choose this model</a>';
      cardbuilder += '</div></div></div>';

      //Apply card to DOM
      modelviewer.innerHTML += cardbuilder;
    }
  );

  /*
  CAROUSEL STEP 3
  */

  //Model details function
  var modeldetails = function() {
    var modeldetails = document.getElementById("modeldetails");
    var listbuilder = '';
    var totalprice = 0;
    var modelkey = this.getAttribute("data-modelid");

    //Build first part
    listbuilder += '<h1 class="mb-3">' + modelsobject["models"][modelkey]["title"] + ' material and pricing details</h1>';
    listbuilder += '<div class="list-group">';

    //Iterate through models and add them as cards
    Object.entries(modelsobject["models"][modelkey]["materials"]).forEach(
      ([key, value]) => {
        //Build each material list
        listbuilder += '<a href="' + value["producturl"];
        listbuilder += '" target="_blank" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">' + value["productname"];
        listbuilder += '<span class="badge bg-primary rounded-pill">$' + value["productprice"] + '</span>';
        listbuilder += '</a>';

        //Parse and add model total
        totalprice = parseFloat(totalprice) + parseFloat(value["productprice"]);
      }
    );

    //Build last part
    listbuilder += '</div>';
    listbuilder += '<h1 class="mt-4 display-6">Model total: $' + totalprice + ' dollars</h1>';

    //Apply card to DOM
    modeldetails.innerHTML += listbuilder;
  };

  //Get HTMLCollection of model buttons
  var modelbuttons = document.getElementsByClassName("modelbutton");

  //Listen for model button to be click then call details function
  Array.from(modelbuttons).forEach(function(e) { e.addEventListener('click', modeldetails); });
};
