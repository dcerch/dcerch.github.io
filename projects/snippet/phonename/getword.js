function phonetoname(phonenumber) {
  var dialpadseq = "";
  var wordsplit = "";
  var wordcomplete = "";

  //Match each phone number to the dialpad sequence
  for (var i = 0; i < phonenumber.length; i++) {
    switch(phonenumber.charAt(i)) {
      case "0":
        dialpadseq += "(0)";
        break;
      case "1":
        dialpadseq += "(1)";
        break;
      case "2":
        dialpadseq += "(ABC)";
        break;
      case "3":
        dialpadseq += "(DEF)";
        break;
      case "4":
        dialpadseq += "(GHI)";
        break;
      case "5":
        dialpadseq += "(JKL)";
        break;
      case "6":
        dialpadseq += "(MNO)";
        break;
      case "7":
        dialpadseq += "(PQRS)";
        break;
      case "8":
        dialpadseq += "(TUV)";
        break;
      case "9":
        dialpadseq += "(WXYZ)";
        break;
    }
  }

  //Split phone number to be used in the table header
  var phonesplit = phonenumber.replace(/\D/g, '').split('');

  //Write initial table element
  var wordcompile = '<div class="table-responsive"><table class="table fs-1"><thead><tr>';

  //Write split phone number to table header
  for (var i = 0; i < phonesplit.length; i++) {
    wordcompile += '<th>' + phonesplit[i] + '</th>';
  }

  //Write end of table header
  wordcompile += '</tr></thead><tbody><tr>';

  //Split dialpad sequence to be used in table body
  wordsplit = dialpadseq.split(/[()]+/).filter(String);

  //Write table body with each split word
  for (var i = 0; i < wordsplit.length; i++) {
    //console.log(wordsplit[i]);
    wordcompile += '<td>';
    for (var j = 0; j < wordsplit[i].length; j++) {
      //console.log(wordsplit[i].charAt(j));
      wordcompile += '<p>' + wordsplit[i].charAt(j) + '</p>';
    }
    wordcompile += '</td>';
    //Add random character to word
    wordcomplete += wordsplit[i].charAt(Math.floor(Math.random()*wordsplit[i].length));
  }

  //Write end of table body
  wordcompile += "</tr></tbody></table></div>";

  //Write entire table to html
  document.getElementById("wordtable").innerHTML = wordcompile;
  document.getElementById("randomword").innerHTML = wordcomplete;
}
