function conversionKey(keydata) {
  var output = [];
  keydata = keydata.split("");
  $.each(keydata,function(i) {
	switch(keydata[i]) {
	  case 'a':
		output.push("65");
		break;
	  case 'b':
		output.push("66");
		break;
	  case 'c':
		output.push("67");
		break;
	  case 'd':
		output.push("68");
		break;
	  case 'e':
		output.push("69");
		break;
	  case 'f':
		output.push("70");
		break;
	  case 'g':
		output.push("71");
		break;
	  case 'h':
		output.push("72");
		break;
	  case 'i':
		output.push("73");
		break;
	  case 'j':
		output.push("74");
		break;
	  case 'k':
		output.push("75");
		break;
	  case 'l':
		output.push("76");
		break;
	  case 'm':
		output.push("77");
		break;
	  case 'n':
		output.push("78");
		break;
	  case 'o':
		output.push("79");
		break;
	  case 'p':
		output.push("80");
		break;
	  case 'q':
		output.push("81");
		break;
	  case 'r':
		output.push("82");
		break;
	  case 's':
		output.push("83");
		break;
	  case 't':
		output.push("84");
		break;
	  case 'u':
		output.push("85");
		break;
	  case 'v':
		output.push("86");
		break;
	  case 'w':
		output.push("87");
		break;
	  case 'x':
		output.push("88");
		break;
	  case 'y':
		output.push("89");
		break;
	  case 'z':
		output.push("90");
		break;
	  case ' ':
		output.push("32");
		break;
	  case ';':
		output.push("186");
		break;
	  case '=':
		output.push("187");
		break;
	  case ',':
		output.push("188");
		break;
	  case '-':
		output.push("189");
		break;
	  case '.':
		output.push("190");
		break;
	  case '[':
		output.push("219");
		break;
	  case ']':
		output.push("221");
		break;
	  case '0':
		output.push("48");
		break;
	  case '1':
		output.push("49");
		break;
	  case '2':
		output.push("50");
		break;
	  case '3':
		output.push("51");
		break;
	  case '4':
		output.push("52");
		break;
	  case '5':
		output.push("53");
		break;
	  case '6':
		output.push("54");
		break;
	  case '7':
		output.push("55");
		break;
	  case '8':
		output.push("56");
		break;
	  case '9':
		output.push("57");
		break;
	}
  });
  return output.join();
}
//Specific to the projects page
function convertKey() {
  var input = $('#converterinput').val();
  $('#converteroutput').html(conversionKey(input));
}