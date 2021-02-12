function debug() {
  //Set values
  $('#formPersonalName').val('John Doe');
  $('#formPersonalOccupation').val('Farmer');
  $('#formPersonalPet').val('Cat');
  $('#formPersonalChildhood').val('Missing Pantaloons');
  $('#formPersonalStab').val('Spoon');
  $('#formPersonalGood').val('Eating');
  $('#formPersonalCarrots').val('3');
  $('#formPersonalIntangible').val('Loneliness');
  $('#formPersonalTangible').val('Horses');
  $('#formPersonalWorksheet').val('Slept');
  $('#formPersonalCondition').val('Exhausted');
  $('#formPersonalMatter').val('Liquid');
  $('#formPersonalSound').val('Brain');
  $('#formPersonalZodiac').val('Leo');
  $('#formPersonalPersonality').val('Sarcastic');
  $('#formKojimaKurt').val('Ego');
  $('#formKojimaKubrick').val('Odyssey');
  $('#formKojimaJoy').val('YMCA');
  $('#formKojimaNPR').val('Umbra');
  $('#formKojimaWar').val('Javelin');
  $('#formKojimaMads').val('Stare');

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
  kojima_kurt = $('#formKojimaKurt').val();
  kojima_kubrick = $('#formKojimaKubrick').val();
  kojima_joy = $('#formKojimaJoy').val();
  kojima_npr = $('#formKojimaNPR').val();
  kojima_war = $('#formKojimaWar').val();
  kojima_mads = $('#formKojimaMads').val();

  console.log('Final Name', kojima_name);
  console.log('DICE [number]:', s1a);
  console.log('DICE [conditions]:', s2a, s2b, s2c, s2d);
  console.log('DICE [categories]:', s3a, s3b, s3c, s3d, s3e, s3f, s3g, s3h);
  console.log('INPUT [personal]:', personal_name, personal_occupation, personal_pet, personal_childhood, personal_stab, personal_good, personal_carrots, personal_intangible, personal_tangible, personal_worksheet, personal_condition, personal_matter, personal_sound, personal_zodiac, personal_personality);
  console.log('INPUT [kojima]:', kojima_kurt, kojima_kubrick, kojima_joy, kojima_npr, kojima_war, kojima_mads);
}
