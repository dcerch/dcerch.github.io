function conversionUTF(utfdata) {
  $.get('https://cors-anywhere.herokuapp.com/https://unicode.org/Public/emoji/12.0/emoji-sequences.txt', function(data) {
    //Match only emoji lines that have user input data in it
    var validateinput = new RegExp(utfdata, 'ig');
    //Match only emoji lines (which start with a letter or number)
    var validatetxt = /^[a-zA-Z0-9]/igm;
    //Match only first emoji
    var validateemoji = /\(.+\)/g;
    //Get all of the text data and split it by new line
    var unicodetxt = data.split('\n');
    //Set output to an empty string
    var output = '';

    //For every emoji line item that matches the user input, assign it to output
    for(var line = 0; line < unicodetxt.length; line++){
      var pointer = unicodetxt[line];
      if(validatetxt.test(pointer))
        if(validateinput.test(pointer)) {
          const emojiprefix = '0x';
          var emoji = pointer.split(';')[0];
          var emojilist = [];

          //Remove leading and trailing spaces
          emoji = emoji.trim();

          //Add prefix to each portion then add to emoji list
          $.each(emoji.split(' '), function(index, value) {
            emojilist.push(emojiprefix + value);
          });

          output = String.fromCodePoint.apply(String, emojilist) + ' ' + output;
        }
    }

    //Overwrite HTML output (note: cannot pass data outside of this get call so it must be written here)
    $('#converteroutput').html(output);
  }, 'text');
}

//Specific to the projects page
function convertUTF() {
  var input = $('#converterinput').val();
  conversionUTF(input);
}
