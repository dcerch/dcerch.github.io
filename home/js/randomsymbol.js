function set_randsym(category) {
  var min;
  var max;
  switch (category) {
	case 0:
	  //C0 Controls and Basic Latin
	  min = 0;
	  max = 127;
	  break;
	case 1:
	  //C1 Controls and Latin-1 Supplement
	  min = 128;
	  max = 255;
	  break;
	case 2:
	  //Latin Extended-A
	  min = 256;
	  max = 383;
	  break;
	case 3:
	  //Latin Extended-B
	  min = 384;
	  max = 591;
	  break;
	case 4:
	  //Spacing Modifiers
	  min = 688;
	  max = 767;
	  break;
	case 5:
	  //Diacritical Marks
	  min = 768;
	  max = 879;
	  break;
	case 6:
	  //Greek and Coptic
	  min = 880;
	  max = 1023;
	  break;
	case 7:
	  //Cyrillic Basic
	  min = 1024;
	  max = 1279;
	  break;
	case 8:
	  //Cyrillic Supplement
	  min = 1280;
	  max = 1327;
	  break;
	case 9:
	  //General Punctuation
	  min = 8192;
	  max = 8303;
	  break;
	case 10:
	  //Currency Symbols
	  min = 8352;
	  max = 8399;
	  break;
	case 11:
	  //Letterlike Symbols
	  min = 8448;
	  max = 8527;
	  break;
	case 12:
	  //Arrows
	  min = 8592;
	  max = 8703;
	  break;
	case 13:
	  //Mathematical Operators
	  min = 8704;
	  max = 8959;
	  break;
	case 14:
	  //Box Drawings
	  min = 9472;
	  max = 9599;
	  break;
	case 15:
	  //Block Elements
	  min = 9600;
	  max = 9631;
	  break;
	case 16:
	  //Geometric Shapes
	  min = 9632;
	  max = 9727;
	  break;
	case 17:
	  //Miscellaneous Symbols
	  min = 9728;
	  max = 9983;
	  break;
	case 18:
	  //Dingbats
	  min = 9984;
	  max = 10175;
	  break;
	default: 
	  //All UTF-8 Character Codes
	  min = 0;
	  max = 10175;
  }
  var randsym = Math.floor((Math.random() * (max - min + 1)) + min);
  randsym = "&#" + randsym + ";";
  return randsym;
}