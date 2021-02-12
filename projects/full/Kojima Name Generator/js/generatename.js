/* USER INPUT */

//Personal input
var personal_name = '';
var personal_occupation = '';
var personal_pet = '';
var personal_childhood = '';
var personal_stab = '';
var personal_good = '';
var personal_carrots = '';
var personal_intangible = '';
var personal_tangible = '';
var personal_worksheet = '';
var personal_condition = '';
var personal_matter = '';
var personal_sound = '';
var personal_zodiac = '';
var personal_personality = '';

//Kojima input
var kojima_kurt = '';
var kojima_kubrick = '';
var kojima_joy = '';
var kojima_npr = '';
var kojima_war = '';
var kojima_mads = '';

//Array of Kojima name(s)
var kojima_name = [];

function generateName() {
  //Personal input
  personal_name = $('#formPersonalName').val();
  personal_occupation = $('#formPersonalOccupation').val();
  personal_pet = $('#formPersonalPet').val();
  personal_childhood = $('#formPersonalChildhood').val();
  personal_stab = $('#formPersonalStab').val();
  personal_good = $('#formPersonalGood').val();
  personal_carrots = $('#formPersonalCarrots').val();
  personal_intangible = $('#formPersonalIntangible').val();
  personal_tangible = $('#formPersonalTangible').val();
  personal_worksheet = $('#formPersonalWorksheet').val();
  personal_condition = $('#formPersonalCondition').val();
  personal_matter = $('#formPersonalMatter').val();
  personal_sound = $('#formPersonalSound').val();
  personal_zodiac = $('#formPersonalZodiac').val();
  personal_personality = $('#formPersonalPersonality').val();

  //Kojima input
  kojima_kurt = $('#formKojimaKurt').val();
  kojima_kubrick = $('#formKojimaKubrick').val();
  kojima_joy = $('#formKojimaJoy').val();
  kojima_npr = $('#formKojimaNPR').val();
  kojima_war = $('#formKojimaWar').val();
  kojima_mads = $('#formKojimaMads').val();

  /* NUMBER SECTION [s1a]: Determining How Many Names You Have
  Kojima often creates characters that have many alternate names, so we must first figure out how many names you will have.
  */
  kojima_name = [];
  var name_count = 1;
  //If a 6 was rolled for alternate names, set name count to 7 (1 true name + 6 alternate names)
  if(s1a == 6) {
    name_count = 7;
  }
  for (i = 0; i < name_count; i++) {
    rollDice();

    var name_wip = '';

    /* CATEGORY SECTION [s3a, s3b, s3c, s3d, s3e, s3f, s3g, s3h]: Determining Your Name Category
    Kojima names fall into a finite number of categories.This section will determine the category in which your name belongs.
    NOTE: If you have a name + 6 alternate names, you will do this section once to find your true name, and then you will have an alternate name in every other category.
    */
    //Normal
    if(s3a == 1) {
      name_wip = personal_name;
    }

    //Occupational
    if(s3a >= 2 && s3a <= 6) {
      switch(s3c) {
        case 1:
          name_wip = personal_personality;
          break;
        case 2:
          name_wip = personal_good;
          break;
        case 3:
          name_wip = personal_sound;
          break;
        case 4:
          name_wip = kojima_kurt;
          break;
      }
      name_wip = name_wip + ' ' + personal_occupation;
    }

    //Horny
    if(s3a >= 7 && s3a <= 10) {
      switch(s3d) {
        case 1:
          name_wip = personal_matter;
          break;
        case 2:
          name_wip = 'Naked';
          break;
        case 3:
          name_wip = personal_good;
          break;
        case 4:
          name_wip = personal_zodiac;
          break;
      }
      if(s3d % 2 != 0) {
        name_wip = name_wip + ' Lickable';
      }
      name_wip = name_wip + ' ' + personal_pet;
    }

    //The
    if(s3a >= 11 && s3a <= 13) {
      name_wip = 'The';
      switch(s3e) {
        case 1:
          name_wip = name_wip + ' ' + personal_intangible;
          break;
        case 2:
          name_wip = name_wip + ' ' + personal_tangible;
          break;
        case 3:
          name_wip = name_wip + ' ' + personal_childhood;
          break;
        case 4:
          name_wip = name_wip + ' ' + kojima_war;
          break;
      }
    }

    //Cool
    if(s3a >= 14 && s3a <= 17) {
      name_wip = kojima_mads;
      switch(s3f) {
        case 1:
          name_wip = name_wip + ' ' + kojima_kubrick;
          break;
        case 2:
          name_wip = name_wip + ' ' + kojima_joy;
          break;
        case 3:
          name_wip = name_wip + ' ' + kojima_npr;
          break;
        case 4:
          name_wip = name_wip + ' ' + personal_good;
          break;
        case 5:
          name_wip = name_wip + ' ' + personal_intangible;
          break;
        case 6:
          name_wip = name_wip + ' ' + personal_sound;
          break;
      }
    }

    //Violent
    if(s3a >= 18 && s3a <= 19) {
      switch(s3g) {
        case 1:
          name_wip = kojima_npr;
          break;
        case 2:
          name_wip = personal_matter;
          break;
        case 3:
          name_wip = kojima_war;
          break;
        case 4:
          name_wip = personal_tangible;
          break;
      }
      name_wip = name_wip + ' ' + personal_stab;
    }

    //Subtext
    if(s3a == 20) {
      name_wip = personal_worksheet;
    }

    /* CONDITION SECTION [s2a, s2b, s2c, s2b, s2d]: Determining Your Name Conditions
    Sometimes, a character will have a plot-based condition that affects their name.
    You, too, might have a condition that affects your name.
    Conditions can stack, so please make note of how many your name has.
    */
    //-man
    if(s2a == 4) {
      name_wip = name_wip + '-man';
    }

    //condition
    if(s2b == 6) {
      if(s3a >= 11 && s3a <= 13) {
        name_wip = name_wip.slice(0, 3) + ' Big ' + name_wip.slice(3);
      }
      else {
        name_wip = 'Big ' + name_wip;
      }
    }
    if(s2b == 7) {
      if(s3a >= 11 && s3a <= 13) {
        name_wip = name_wip.slice(0, 3) + ' Old ' + name_wip.slice(3);
      }
      else {
        name_wip = 'Old ' + name_wip;
      }
    }
    if(s2b == 8) {
      if(s3a >= 11 && s3a <= 13) {
        name_wip = name_wip.slice(0, 3) + ' ' + personal_condition + ' ' + name_wip.slice(3);
      }
      else {
        name_wip = personal_condition + ' ' + name_wip;
      }
    }

    //clone
    if(s2c == 6) {
      name_wip = 'Clone of ' + name_wip;
    }

    //kojima
    if(s2d == 69) {
      name_wip = 'Hideo Kojima';
    }

    //Push generated name
    kojima_name.push(name_wip);
  }
}
