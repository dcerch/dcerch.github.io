var db = firebase.firestore();
var usersRef = db.collection('users');
var userinfo = {};

/*
SIGN INTO FEARLESS
*/
$('#signinform').submit(function(event) {
  //Empty userinfo for new sign in submissions
  userinfo = {};

  usersRef.get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      var phoneinput = $('#signinphone').val();
      var phonefirestore = doc.data()['phone'];

      if(phoneinput == phonefirestore) {
        userinfo = doc.data();
        userinfo.id = doc.id;
      }
    });
    console.log($.isEmptyObject(userinfo), userinfo);

    //Display add new user section since user cannot be found
    if($.isEmptyObject(userinfo)) {
      $('section').addClass('collapse');
      $('#add').removeClass('collapse');
    }
    //Display verify section since user is found
    else {
      $('#verify').html('<h1 class="display-4">Hello, ' + userinfo.userfirst + ' ' + userinfo.userlast + '!</h1><h1>Is this you?</h1><div class="btn-group" role="group" aria-label="Basic example"><button type="button" class="btn btn-primary btn-lg px-5" id="verifycorrect">Yes</button><button type="button" class="btn btn-warning btn-lg px-5" id="verifyincorrect">No</button></div>');
      $('section').addClass('collapse');
      $('#verify').removeClass('collapse');
    }
  });

  event.preventDefault();
});

/*
VERIFY SIGN IN INFORMATION
*/
//Listen if user does verify themself, display welcome page
$('#verify').on('click', '#verifycorrect', function() {
  //Update local streak and last sign in
  userinfo.streak += 1;
  userinfo.lastsignin = new Date().toLocaleDateString('en-US');

  //Update firestore streak
  usersRef.doc(userinfo.id).update({ streak: userinfo.streak, lastsignin: userinfo.lastsignin })
    .then(function() {
      console.log("Document successfully updated! Streak + 1 and sign in");
    });

  displaywelcome();
});

//Listen if user does not verify themself, display sign in page
$('#verify').on('click', '#verifyincorrect', function() {
  $('section').addClass('collapse');
  $('#signin').removeClass('collapse');
});

/*
ADD NEW USER TO FIRESTORE
*/
$('#addform').submit(function(event) {
  //Create empty object for firestore
  var registration = {};

  //Add phone and streak to object
  registration['phone'] = $('#signinphone').val();
  registration['streak'] = 0;
  registration['lastsignin'] = new Date().toLocaleDateString('en-US');

  //Loop through all inputs in the form, add to object, exclude undefined inputs
  $("form#addform :input").each(function() {
    var inputname = $(this).attr('name');
    var inputvalue = $(this).val();

    //Special add: Leader
    if(inputname == 'leader') {
      if($(this).prop('checked')) {
        inputvalue = 'true';
      }
      else {
        inputvalue = 'false';
      }
    }

    if(inputname != undefined && inputvalue != undefined) {
      registration[inputname] = inputvalue;
    }
  });

  //Submit object to firestore
  usersRef.add(registration)
    .then(function(docRef) {
      console.log('Document written with ID: ', docRef.id);
    })
    .catch(function(error) {
      console.error('Error adding document: ', error);
    });

  //Set userinfo to registration since user is already verified
  userinfo = registration;

  //Show welcome
  displaywelcome();

  event.preventDefault();
});

/*
WELCOME REGISTERED USER
*/
function displaywelcome() {
  var welcometext = '<h1 class="display-4">You are all signed in, ' + userinfo.userfirst + '!</h1>';

  if(userinfo.streak >= 10) {
    welcometext += '<p>You are among the best of the best. Your consistency has proven your pursuit for God, Faith, and purpose. You have attended Fearless a whopping ' + userinfo.streak + ' times! Amazing effort! ⭐</p>';
  }
  else if(userinfo.streak >= 5 && userinfo.streak <= 9) {
    welcometext += '<p>You have attended Fearless ' + userinfo.streak + ' times! Continue to keep up that consistency and it will ultimately lead you down the right path. You are a rockstar! 👏</p>';
  }
  else if(userinfo.streak >= 2 && userinfo.streak <= 4) {
    welcometext += '<p>It is great to see you again! You are on roll! You have attended Fearless ' + userinfo.streak + ' times! Keep up the streak! 👌</p>';
  }
  else {
    welcometext += '<p>Welcome to Fearless! This is where we get to empower you to live FEARLESS in every area of your life! Cannot wait to see what you are capable of! 💪</p>';
  }

  $('#welcome').html(welcometext);

  //Display welcome section
  $('section').addClass('collapse');
  $('#welcome').removeClass('collapse');
}

/*
LEADERS FIELD TOGGLE
*/
$('#newleader').click(function() {
  //Rremove required, disable and hide fomr, set blank value
  if($(this).prop('checked')) {
    $('#newbirthday').prop({'required': false, 'disabled': true});
    $('#newgrade').prop({'required': false, 'disabled': true});
    $('#newparentfirst').prop({'required': false, 'disabled': true});
    $('#newparentlast').prop({'required': false, 'disabled': true});
    $('#newparentemail').prop({'disabled': true});
    $('#newparentphone').prop({'disabled': true});


    $('#newbirthday').val('');
    $('#newgrade').val('');
    $('#newparentfirst').val('');
    $('#newparentlast').val('');
    $('#newparentemail').val('');
    $('#newparentphone').val('');

    $('#newbirthday').parent().hide();
    $('#newgrade').parent().hide();
    $('#newparentfirst').parent().hide();
    $('#newparentlast').parent().hide();
    $('#newparentemail').parent().hide();
    $('#newparentphone').parent().hide();
  }
  //Enable form and remove N/A value
  else {
    $('#newbirthday').prop({'required': true, 'disabled': false});
    $('#newgrade').prop({'required': true, 'disabled': false});
    $('#newparentfirst').prop({'required': true, 'disabled': false});
    $('#newparentlast').prop({'required': true, 'disabled': false});
    $('#newparentemail').prop({'disabled': false});
    $('#newparentphone').prop({'disabled': false});

    $('#newbirthday').parent().show();
    $('#newgrade').parent().show();
    $('#newparentfirst').parent().show();
    $('#newparentlast').parent().show();
    $('#newparentemail').parent().show();
    $('#newparentphone').parent().show();
  }
});
