const products = {
  'rpi0': {
    'Case': [
      {'title': 'Retroflag Gameboy', 'image': 'https://images-na.ssl-images-amazon.com/images/I/61it-2ZuMuL._SL1500_.jpg', 'purchase': 'https://www.amazon.com/dp/B07RT9VGS4', 'price': '60'},
      {'title': 'C4Labs Black Ice', 'image': 'https://images-na.ssl-images-amazon.com/images/I/41tmrAQ8t7L.jpg', 'purchase': 'https://www.amazon.com/dp/B01HP636I4', 'price': '7'},
      {'title': 'RPi Foundation White/Pink', 'image': 'https://images-na.ssl-images-amazon.com/images/I/51sZiyBokZL._SL1000_.jpg', 'purchase': 'https://www.amazon.com/dp/B06Y593MHV', 'price': '6'},
      {'title': 'C4Labs Wooden', 'image': 'https://images-na.ssl-images-amazon.com/images/I/41BU0LfmJ7L.jpg', 'purchase': 'https://www.amazon.com/dp/B01F9RTFIQ', 'price': '7'},
      {'title': 'C4Labs Wooden/Transparent', 'image': 'https://images-na.ssl-images-amazon.com/images/I/61C00Xl9VGL._SL1000_.jpg', 'purchase': 'https://www.amazon.com/dp/B01FRHTY16', 'price': '7'},
    ],
    'Storage': [
      {'title': 'Samsung EVO 64GB', 'image': 'https://images-na.ssl-images-amazon.com/images/I/81rpcHc0XzL._SL1500_.jpg', 'purchase': 'https://www.amazon.com/dp/B06XX29S9Q', 'price': '12'},
      {'title': 'SanDisk Ultra 64GB', 'image': 'https://images-na.ssl-images-amazon.com/images/I/61TPoMI1NZL._SL1100_.jpg', 'purchase': 'https://www.amazon.com/dp/B073JYVKNX', 'price': '12'},
      {'title': 'Silicon Power 64GB', 'image': 'https://images-na.ssl-images-amazon.com/images/I/71k1mn9y16L._SL1500_.jpg', 'purchase': 'https://www.amazon.com/dp/B07Q384YXY', 'price': '10'},
      {'title': 'PNY Elite 64GB', 'image': 'https://images-na.ssl-images-amazon.com/images/I/61usEPP2htL._SL1000_.jpg', 'purchase': 'https://www.amazon.com/dp/B01G26R7M4', 'price': '15'},
    ],
    'Power': [
      {'title': 'CanaKit Micro USB Charger', 'image': 'https://images-na.ssl-images-amazon.com/images/I/51KgJwxynLL.jpg', 'purchase': 'https://www.amazon.com/dp/B00MARDJZ4', 'price': '10'},
      {'title': 'Enokay Micro USB Charger with Switch', 'image': 'https://images-na.ssl-images-amazon.com/images/I/61G%2BuahaiSL._SL1200_.jpg', 'purchase': 'https://www.amazon.com/dp/B01MZX466R', 'price': '9'},
      {'title': 'PWR+ Micro USB Charger with Switch', 'image': 'https://images-na.ssl-images-amazon.com/images/I/71xzZZT3U0L._SL1500_.jpg', 'purchase': 'https://www.amazon.com/dp/B00L88M8TE', 'price': '14'},
    ],
    'Travel': [
      {'title': 'Caseling Case', 'image': 'https://images-na.ssl-images-amazon.com/images/I/4160g6l-FqL.jpg', 'purchase': 'https://www.amazon.com/dp/B0141IMD38/', 'price': '14'},
      {'title': 'RDS Industries NES Case', 'image': 'https://images-na.ssl-images-amazon.com/images/I/61XC-2mx7LL._AC_.jpg', 'purchase': 'https://www.amazon.com/dp/B01LYFRCWF/', 'price': '50'},
      {'title': 'CASEMATIX Case with Customizable Foam', 'image': 'https://images-na.ssl-images-amazon.com/images/I/81GQhCNB8OL._SL1500_.jpg', 'purchase': 'https://www.amazon.com/dp/B0170RIRVY/', 'price': '25'},
      {'title': 'AmazonBasics Small Case', 'image': 'https://images-na.ssl-images-amazon.com/images/I/91or%2BmTVQHL._SL1500_.jpg', 'purchase': 'https://www.amazon.com/dp/B002VPE1QG/', 'price': '12'},
      {'title': 'AmazonBasics Medium Case', 'image': 'https://images-na.ssl-images-amazon.com/images/I/516OPdfJvDL._AC_.jpg', 'purchase': 'https://www.amazon.com/dp/B0714R28X6/', 'price': '10'},
      {'title': 'Drone Pit Stop with Customizable Foam', 'image': 'https://images-na.ssl-images-amazon.com/images/I/71SfP5U9qqL._SL1000_.jpg', 'purchase': 'https://www.amazon.com/dp/B01DI94TRY/', 'price': '30'},
      {'title': 'BAGSMART Case', 'image': 'https://images-na.ssl-images-amazon.com/images/I/71Xri3AdEZL._SL1100_.jpg', 'purchase': 'https://www.amazon.com/dp/B00R5U0UBW/', 'price': '17'},
    ],
    'Accessories': [
      {'title': 'Anker USB 3.0 microSD+SD', 'image': 'https://images-na.ssl-images-amazon.com/images/I/5109OkU3xlL._SL1000_.jpg', 'purchase': 'https://www.amazon.com/dp/B006T9B6R2', 'price': '12'},
      {'title': 'SmartQ USB 3.0 microSD+SD', 'image': 'https://images-na.ssl-images-amazon.com/images/I/51EWYgXoZ8L._SL1000_.jpg', 'purchase': 'https://www.amazon.com/dp/B06ZYXR7DL', 'price': '7'},
      {'title': 'SanDisk USB 3.0 microSD', 'image': 'https://images-na.ssl-images-amazon.com/images/I/61WNfOD-O7L._SL1100_.jpg', 'purchase': 'https://www.amazon.com/dp/B07G5JV2B5', 'price': '13'},
      {'title': 'Foxnovo International Charger with USB', 'image': 'https://images-na.ssl-images-amazon.com/images/I/51STa9BkH9L._SL1200_.jpg', 'purchase': 'https://www.amazon.com/dp/B07G2QDCX1', 'price': '10'},
      {'title': 'RPi Foundation Camera', 'image': 'https://images-na.ssl-images-amazon.com/images/I/51kEQoHGudL._SL1000_.jpg', 'purchase': 'https://www.amazon.com/dp/B01ER2SKFS', 'price': '25'},
      {'title': 'RPi Foundation LCD Touchscreen', 'image': 'https://images-na.ssl-images-amazon.com/images/I/61DkEsboSpL._SL1000_.jpg', 'purchase': 'https://www.amazon.com/dp/B0153R2A9I', 'price': '65'},
      {'title': 'RPi Foundation LCD Touchscreen Case', 'image': 'https://images-na.ssl-images-amazon.com/images/I/61f4fD1JVWL._SL1200_.jpg', 'purchase': 'https://www.amazon.com/dp/B014HDG74S', 'price': '38'},
      {'title': 'RPi Foundation Sense HAT', 'image': 'https://images-na.ssl-images-amazon.com/images/I/51HCigIAyiL.jpg', 'purchase': 'https://www.amazon.com/dp/B01GQFUWIC', 'price': '15'},
      {'title': 'Logitech K400 Wireless Keyboard+Mouse Grey', 'image': 'https://images-na.ssl-images-amazon.com/images/I/61OeLOPEz9L._SL1500_.jpg', 'purchase': 'https://www.amazon.com/dp/B014EUQOGK', 'price': '25'},
      {'title': 'Logitech K400 Wireless Keyboard+Mouse Black', 'image': 'https://images-na.ssl-images-amazon.com/images/I/81wMFKCb7vL._SL1500_.jpg', 'purchase': 'https://www.amazon.com/dp/B005DKZTMG', 'price': '19'},
      {'title': 'AmazonBasics HDMI to HDMI', 'image': 'https://images-na.ssl-images-amazon.com/images/I/71TAXrJ5qmL._SL1500_.jpg', 'purchase': 'https://www.amazon.com/dp/B014I8SSD0', 'price': '7'},
      {'title': 'AmazonBasics HDMI to microHDMI', 'image': 'https://images-na.ssl-images-amazon.com/images/I/71qprGXBdwL._SL1500_.jpg', 'purchase': 'https://www.amazon.com/dp/B014I8U33I', 'price': '7'},
      {'title': 'AmazonBasics HDMI to miniHDMI', 'image': 'https://images-na.ssl-images-amazon.com/images/I/71ycz%2BorA3L._SL1500_.jpg', 'purchase': 'https://www.amazon.com/dp/B014I8UEGY', 'price': '7'},
      {'title': 'AmazonBasics HDMI to DisplayPort', 'image': 'https://images-na.ssl-images-amazon.com/images/I/71J2uGmSl3L._SL1500_.jpg', 'purchase': 'https://www.amazon.com/dp/B015OW3M1W', 'price': '11'},
    ]
  },
  'rpi3': {
    'Case': [
      {'title': 'Retroflag SNES Purple', 'image': 'https://images-na.ssl-images-amazon.com/images/I/71WhX14Pc0L._SL1500_.jpg', 'purchase': 'https://www.amazon.com/dp/B07W5L95KK?', 'price': '20'},
      {'title': 'Retroflag SNES Grey', 'image': 'https://images-na.ssl-images-amazon.com/images/I/71rRwzZRhkL._SL1500_.jpg', 'purchase': 'https://www.amazon.com/dp/B07WBVXPXP', 'price': '20'},
      {'title': 'Retroflag MEGA', 'image': 'https://images-na.ssl-images-amazon.com/images/I/61F38pNez0L._SL1500_.jpg', 'purchase': 'https://www.amazon.com/dp/B07JMLHVQN', 'price': '23'},
      {'title': 'Retroflag NES', 'image': 'https://images-na.ssl-images-amazon.com/images/I/51do9eHyyJL._SL1500_.jpg', 'purchase': 'https://www.amazon.com/dp/B07BRHDVTN', 'price': '23'},
      {'title': 'OneNineDesign Black', 'image': 'https://images-na.ssl-images-amazon.com/images/I/41CdYS1EvWL.jpg', 'purchase': 'https://www.amazon.com/dp/B00UW2G1BS', 'price': '7'},
      {'title': 'SB Components Transparent', 'image': 'https://images-na.ssl-images-amazon.com/images/I/51nsjlm%2BF5L._SL1000_.jpg', 'purchase': 'https://www.amazon.com/dp/B00MQLB1N6/', 'price': '5'},
      {'title': 'Flirc Aluminum', 'image': 'https://images-na.ssl-images-amazon.com/images/I/514B76sMz2L._SL1500_.jpg', 'purchase': 'https://www.amazon.com/dp/B07349HT26/', 'price': '12'},
      {'title': 'C4Labs Wooden', 'image': 'https://images-na.ssl-images-amazon.com/images/I/51%2BQdEfkzxL.jpg', 'purchase': 'https://www.amazon.com/dp/B01GQMDN2W/', 'price': '17'},
      {'title': 'RPi Foundation Grey', 'image': 'https://images-na.ssl-images-amazon.com/images/I/71i-UKw5WlL._SL1500_.jpg', 'purchase': 'https://www.amazon.com/dp/B01F1PSFY6/', 'price': '8'},
    ],
    'Storage': [
      {'title': 'Samsung EVO 64GB', 'image': 'https://images-na.ssl-images-amazon.com/images/I/81rpcHc0XzL._SL1500_.jpg', 'purchase': 'https://www.amazon.com/dp/B06XX29S9Q', 'price': '12'},
      {'title': 'SanDisk Ultra 64GB', 'image': 'https://images-na.ssl-images-amazon.com/images/I/61TPoMI1NZL._SL1100_.jpg', 'purchase': 'https://www.amazon.com/dp/B073JYVKNX', 'price': '12'},
      {'title': 'Silicon Power 64GB', 'image': 'https://images-na.ssl-images-amazon.com/images/I/71k1mn9y16L._SL1500_.jpg', 'purchase': 'https://www.amazon.com/dp/B07Q384YXY', 'price': '10'},
      {'title': 'PNY Elite 64GB', 'image': 'https://images-na.ssl-images-amazon.com/images/I/61usEPP2htL._SL1000_.jpg', 'purchase': 'https://www.amazon.com/dp/B01G26R7M4', 'price': '15'},
    ],
    'Power': [
      {'title': 'CanaKit Micro USB Charger', 'image': 'https://images-na.ssl-images-amazon.com/images/I/51KgJwxynLL.jpg', 'purchase': 'https://www.amazon.com/dp/B00MARDJZ4', 'price': '10'},
      {'title': 'Enokay Micro USB Charger with Switch', 'image': 'https://images-na.ssl-images-amazon.com/images/I/61G%2BuahaiSL._SL1200_.jpg', 'purchase': 'https://www.amazon.com/dp/B01MZX466R', 'price': '9'},
      {'title': 'PWR+ Micro USB Charger with Switch', 'image': 'https://images-na.ssl-images-amazon.com/images/I/71xzZZT3U0L._SL1500_.jpg', 'purchase': 'https://www.amazon.com/dp/B00L88M8TE', 'price': '14'},
    ],
    'Controllers': [
      {'title': 'Logitech Gamepad F310', 'image': 'https://images-na.ssl-images-amazon.com/images/I/71uoG-y-bEL._SL1500_.jpg', 'purchase': 'https://www.amazon.com/dp/B003VAHYQY/', 'price': '15'},
      {'title': 'Logitech Gamepad F710', 'image': 'https://images-na.ssl-images-amazon.com/images/I/71cY%2B1dSNnL._SL1500_.jpg', 'purchase': 'https://www.amazon.com/dp/B0041RR0TW/', 'price': '40'},
      {'title': 'Retro Power NES, SNES, Sega Genesis, N64, PS2', 'image': 'https://images-na.ssl-images-amazon.com/images/I/91jYCRabKBL._SL1500_.jpg', 'purchase': 'https://www.amazon.com/dp/B07491YH2R/', 'price': '42'},
      {'title': 'Buffalo SNES', 'image': 'https://images-na.ssl-images-amazon.com/images/I/61O8NZuAdsL._SL1001_.jpg', 'purchase': 'https://www.amazon.com/dp/B002B9XB0E', 'price': '30'},
      {'title': 'Retro Power Gamecube, Sega Saturn, Xbox', 'image': 'https://images-na.ssl-images-amazon.com/images/I/91cSoHXfHaL._SL1500_.jpg', 'purchase': 'https://www.amazon.com/dp/B079FG2PL6', 'price': '32'},
      {'title': 'iNNEXT SNES-Styled', 'image': 'https://images-na.ssl-images-amazon.com/images/I/A1gcrr7hngL._SL1500_.jpg', 'purchase': 'https://www.amazon.com/dp/B01N7ANDLC/', 'price': '11'},
      {'title': 'ZD-V+ Gamepad', 'image': 'https://images-na.ssl-images-amazon.com/images/I/61qItTcisGL._SL1000_.jpg', 'purchase': 'https://www.amazon.com/dp/B00OAYHIRA/', 'price': '20'},
    ],
    'Travel': [
      {'title': 'Caseling Case', 'image': 'https://images-na.ssl-images-amazon.com/images/I/4160g6l-FqL.jpg', 'purchase': 'https://www.amazon.com/dp/B0141IMD38/', 'price': '14'},
      {'title': 'RDS Industries NES Case', 'image': 'https://images-na.ssl-images-amazon.com/images/I/61XC-2mx7LL._AC_.jpg', 'purchase': 'https://www.amazon.com/dp/B01LYFRCWF/', 'price': '50'},
      {'title': 'CASEMATIX Case with Customizable Foam', 'image': 'https://images-na.ssl-images-amazon.com/images/I/81GQhCNB8OL._SL1500_.jpg', 'purchase': 'https://www.amazon.com/dp/B0170RIRVY/', 'price': '25'},
      {'title': 'AmazonBasics Small Case', 'image': 'https://images-na.ssl-images-amazon.com/images/I/91or%2BmTVQHL._SL1500_.jpg', 'purchase': 'https://www.amazon.com/dp/B002VPE1QG/', 'price': '12'},
      {'title': 'AmazonBasics Medium Case', 'image': 'https://images-na.ssl-images-amazon.com/images/I/516OPdfJvDL._AC_.jpg', 'purchase': 'https://www.amazon.com/dp/B0714R28X6/', 'price': '10'},
      {'title': 'Drone Pit Stop with Customizable Foam', 'image': 'https://images-na.ssl-images-amazon.com/images/I/71SfP5U9qqL._SL1000_.jpg', 'purchase': 'https://www.amazon.com/dp/B01DI94TRY/', 'price': '30'},
      {'title': 'BAGSMART Case', 'image': 'https://images-na.ssl-images-amazon.com/images/I/71Xri3AdEZL._SL1100_.jpg', 'purchase': 'https://www.amazon.com/dp/B00R5U0UBW/', 'price': '17'},
    ],
    'Accessories': [
      {'title': 'Anker USB 3.0 microSD+SD', 'image': 'https://images-na.ssl-images-amazon.com/images/I/5109OkU3xlL._SL1000_.jpg', 'purchase': 'https://www.amazon.com/dp/B006T9B6R2', 'price': '12'},
      {'title': 'SmartQ USB 3.0 microSD+SD', 'image': 'https://images-na.ssl-images-amazon.com/images/I/51EWYgXoZ8L._SL1000_.jpg', 'purchase': 'https://www.amazon.com/dp/B06ZYXR7DL', 'price': '7'},
      {'title': 'SanDisk USB 3.0 microSD', 'image': 'https://images-na.ssl-images-amazon.com/images/I/61WNfOD-O7L._SL1100_.jpg', 'purchase': 'https://www.amazon.com/dp/B07G5JV2B5', 'price': '13'},
      {'title': 'Foxnovo International Charger with USB', 'image': 'https://images-na.ssl-images-amazon.com/images/I/51STa9BkH9L._SL1200_.jpg', 'purchase': 'https://www.amazon.com/dp/B07G2QDCX1', 'price': '10'},
      {'title': 'RPi Foundation Camera', 'image': 'https://images-na.ssl-images-amazon.com/images/I/51kEQoHGudL._SL1000_.jpg', 'purchase': 'https://www.amazon.com/dp/B01ER2SKFS', 'price': '25'},
      {'title': 'RPi Foundation LCD Touchscreen', 'image': 'https://images-na.ssl-images-amazon.com/images/I/61DkEsboSpL._SL1000_.jpg', 'purchase': 'https://www.amazon.com/dp/B0153R2A9I', 'price': '65'},
      {'title': 'RPi Foundation LCD Touchscreen Case', 'image': 'https://images-na.ssl-images-amazon.com/images/I/61f4fD1JVWL._SL1200_.jpg', 'purchase': 'https://www.amazon.com/dp/B014HDG74S', 'price': '38'},
      {'title': 'RPi Foundation Sense HAT', 'image': 'https://images-na.ssl-images-amazon.com/images/I/51HCigIAyiL.jpg', 'purchase': 'https://www.amazon.com/dp/B01GQFUWIC', 'price': '15'},
      {'title': 'Logitech K400 Wireless Keyboard+Mouse Grey', 'image': 'https://images-na.ssl-images-amazon.com/images/I/61OeLOPEz9L._SL1500_.jpg', 'purchase': 'https://www.amazon.com/dp/B014EUQOGK', 'price': '25'},
      {'title': 'Logitech K400 Wireless Keyboard+Mouse Black', 'image': 'https://images-na.ssl-images-amazon.com/images/I/81wMFKCb7vL._SL1500_.jpg', 'purchase': 'https://www.amazon.com/dp/B005DKZTMG', 'price': '19'},
      {'title': 'AmazonBasics HDMI to HDMI', 'image': 'https://images-na.ssl-images-amazon.com/images/I/71TAXrJ5qmL._SL1500_.jpg', 'purchase': 'https://www.amazon.com/dp/B014I8SSD0', 'price': '7'},
      {'title': 'AmazonBasics HDMI to microHDMI', 'image': 'https://images-na.ssl-images-amazon.com/images/I/71qprGXBdwL._SL1500_.jpg', 'purchase': 'https://www.amazon.com/dp/B014I8U33I', 'price': '7'},
      {'title': 'AmazonBasics HDMI to miniHDMI', 'image': 'https://images-na.ssl-images-amazon.com/images/I/71ycz%2BorA3L._SL1500_.jpg', 'purchase': 'https://www.amazon.com/dp/B014I8UEGY', 'price': '7'},
      {'title': 'AmazonBasics HDMI to DisplayPort', 'image': 'https://images-na.ssl-images-amazon.com/images/I/71J2uGmSl3L._SL1500_.jpg', 'purchase': 'https://www.amazon.com/dp/B015OW3M1W', 'price': '11'},
    ]
  },
  'rpi4': {
    'Case': [
      {'title': 'Smraza Black', 'image': 'https://images-na.ssl-images-amazon.com/images/I/711eylGtRqL._SL1500_.jpg', 'purchase': 'https://www.amazon.com/dp/B07VCCS17L', 'price': '10'},
      {'title': 'GeeekPi Black/Transparent', 'image': 'https://images-na.ssl-images-amazon.com/images/I/71IPJhZtQBL._SL1000_.jpg', 'purchase': 'https://www.amazon.com/dp/B07TXSQ47L', 'price': '10'},
      {'title': 'GeeekPi Transparent', 'image': 'https://images-na.ssl-images-amazon.com/images/I/51QI5Eo7r8L.jpg', 'purchase': 'https://www.amazon.com/dp/B07T2CPC2H', 'price': '9'},
    ],
    'Storage': [
      {'title': 'Samsung EVO 64GB', 'image': 'https://images-na.ssl-images-amazon.com/images/I/81rpcHc0XzL._SL1500_.jpg', 'purchase': 'https://www.amazon.com/dp/B06XX29S9Q', 'price': '12'},
      {'title': 'SanDisk Ultra 64GB', 'image': 'https://images-na.ssl-images-amazon.com/images/I/61TPoMI1NZL._SL1100_.jpg', 'purchase': 'https://www.amazon.com/dp/B073JYVKNX', 'price': '12'},
      {'title': 'Silicon Power 64GB', 'image': 'https://images-na.ssl-images-amazon.com/images/I/71k1mn9y16L._SL1500_.jpg', 'purchase': 'https://www.amazon.com/dp/B07Q384YXY', 'price': '10'},
      {'title': 'PNY Elite 64GB', 'image': 'https://images-na.ssl-images-amazon.com/images/I/61usEPP2htL._SL1000_.jpg', 'purchase': 'https://www.amazon.com/dp/B01G26R7M4', 'price': '15'},
    ],
    'Power': [
      {'title': 'CanaKit USB-C Charger', 'image': 'https://images-na.ssl-images-amazon.com/images/I/71jpGPpq3HL._SL1500_.jpg', 'purchase': 'https://www.amazon.com/dp/B07TYQRXTK', 'price': '10'},
      {'title': 'CanaKit USB-C Charger with Switch', 'image': 'https://images-na.ssl-images-amazon.com/images/I/61gW19Yip1L._SL1389_.jpg', 'purchase': 'https://www.amazon.com/dp/B07TSFYXBC', 'price': '13'},
      {'title': 'NorthPada USB-C Charger with Switch', 'image': 'https://images-na.ssl-images-amazon.com/images/I/71RBz5WbXHL._SL1500_.jpg', 'purchase': 'https://www.amazon.com/dp/B07V2QRSDH', 'price': '10'},
    ],
    'Controllers': [
      {'title': 'Logitech Gamepad F310', 'image': 'https://images-na.ssl-images-amazon.com/images/I/71uoG-y-bEL._SL1500_.jpg', 'purchase': 'https://www.amazon.com/dp/B003VAHYQY/', 'price': '15'},
      {'title': 'Logitech Gamepad F710', 'image': 'https://images-na.ssl-images-amazon.com/images/I/71cY%2B1dSNnL._SL1500_.jpg', 'purchase': 'https://www.amazon.com/dp/B0041RR0TW/', 'price': '40'},
      {'title': 'Retro Power NES, SNES, Sega Genesis, N64, PS2', 'image': 'https://images-na.ssl-images-amazon.com/images/I/91jYCRabKBL._SL1500_.jpg', 'purchase': 'https://www.amazon.com/dp/B07491YH2R/', 'price': '42'},
      {'title': 'Buffalo SNES', 'image': 'https://images-na.ssl-images-amazon.com/images/I/61O8NZuAdsL._SL1001_.jpg', 'purchase': 'https://www.amazon.com/dp/B002B9XB0E', 'price': '30'},
      {'title': 'Retro Power Gamecube, Sega Saturn, Xbox', 'image': 'https://images-na.ssl-images-amazon.com/images/I/91cSoHXfHaL._SL1500_.jpg', 'purchase': 'https://www.amazon.com/dp/B079FG2PL6', 'price': '32'},
      {'title': 'iNNEXT SNES-Styled', 'image': 'https://images-na.ssl-images-amazon.com/images/I/A1gcrr7hngL._SL1500_.jpg', 'purchase': 'https://www.amazon.com/dp/B01N7ANDLC/', 'price': '11'},
      {'title': 'ZD-V+ Gamepad', 'image': 'https://images-na.ssl-images-amazon.com/images/I/61qItTcisGL._SL1000_.jpg', 'purchase': 'https://www.amazon.com/dp/B00OAYHIRA/', 'price': '20'},
    ],
    'Travel': [
      {'title': 'Caseling Case', 'image': 'https://images-na.ssl-images-amazon.com/images/I/4160g6l-FqL.jpg', 'purchase': 'https://www.amazon.com/dp/B0141IMD38/', 'price': '14'},
      {'title': 'RDS Industries NES Case', 'image': 'https://images-na.ssl-images-amazon.com/images/I/61XC-2mx7LL._AC_.jpg', 'purchase': 'https://www.amazon.com/dp/B01LYFRCWF/', 'price': '50'},
      {'title': 'CASEMATIX Case with Customizable Foam', 'image': 'https://images-na.ssl-images-amazon.com/images/I/81GQhCNB8OL._SL1500_.jpg', 'purchase': 'https://www.amazon.com/dp/B0170RIRVY/', 'price': '25'},
      {'title': 'AmazonBasics Small Case', 'image': 'https://images-na.ssl-images-amazon.com/images/I/91or%2BmTVQHL._SL1500_.jpg', 'purchase': 'https://www.amazon.com/dp/B002VPE1QG/', 'price': '12'},
      {'title': 'AmazonBasics Medium Case', 'image': 'https://images-na.ssl-images-amazon.com/images/I/516OPdfJvDL._AC_.jpg', 'purchase': 'https://www.amazon.com/dp/B0714R28X6/', 'price': '10'},
      {'title': 'Drone Pit Stop with Customizable Foam', 'image': 'https://images-na.ssl-images-amazon.com/images/I/71SfP5U9qqL._SL1000_.jpg', 'purchase': 'https://www.amazon.com/dp/B01DI94TRY/', 'price': '30'},
      {'title': 'BAGSMART Case', 'image': 'https://images-na.ssl-images-amazon.com/images/I/71Xri3AdEZL._SL1100_.jpg', 'purchase': 'https://www.amazon.com/dp/B00R5U0UBW/', 'price': '17'},
    ],
    'Accessories': [
      {'title': 'Anker USB 3.0 microSD+SD', 'image': 'https://images-na.ssl-images-amazon.com/images/I/5109OkU3xlL._SL1000_.jpg', 'purchase': 'https://www.amazon.com/dp/B006T9B6R2', 'price': '12'},
      {'title': 'SmartQ USB 3.0 microSD+SD', 'image': 'https://images-na.ssl-images-amazon.com/images/I/51EWYgXoZ8L._SL1000_.jpg', 'purchase': 'https://www.amazon.com/dp/B06ZYXR7DL', 'price': '7'},
      {'title': 'SanDisk USB 3.0 microSD', 'image': 'https://images-na.ssl-images-amazon.com/images/I/61WNfOD-O7L._SL1100_.jpg', 'purchase': 'https://www.amazon.com/dp/B07G5JV2B5', 'price': '13'},
      {'title': 'Foxnovo International Charger with USB', 'image': 'https://images-na.ssl-images-amazon.com/images/I/51STa9BkH9L._SL1200_.jpg', 'purchase': 'https://www.amazon.com/dp/B07G2QDCX1', 'price': '10'},
      {'title': 'RPi Foundation Camera', 'image': 'https://images-na.ssl-images-amazon.com/images/I/51kEQoHGudL._SL1000_.jpg', 'purchase': 'https://www.amazon.com/dp/B01ER2SKFS', 'price': '25'},
      {'title': 'RPi Foundation LCD Touchscreen', 'image': 'https://images-na.ssl-images-amazon.com/images/I/61DkEsboSpL._SL1000_.jpg', 'purchase': 'https://www.amazon.com/dp/B0153R2A9I', 'price': '65'},
      {'title': 'RPi Foundation LCD Touchscreen Case', 'image': 'https://images-na.ssl-images-amazon.com/images/I/61f4fD1JVWL._SL1200_.jpg', 'purchase': 'https://www.amazon.com/dp/B014HDG74S', 'price': '38'},
      {'title': 'RPi Foundation Sense HAT', 'image': 'https://images-na.ssl-images-amazon.com/images/I/51HCigIAyiL.jpg', 'purchase': 'https://www.amazon.com/dp/B01GQFUWIC', 'price': '15'},
      {'title': 'Logitech K400 Wireless Keyboard+Mouse Grey', 'image': 'https://images-na.ssl-images-amazon.com/images/I/61OeLOPEz9L._SL1500_.jpg', 'purchase': 'https://www.amazon.com/dp/B014EUQOGK', 'price': '25'},
      {'title': 'Logitech K400 Wireless Keyboard+Mouse Black', 'image': 'https://images-na.ssl-images-amazon.com/images/I/81wMFKCb7vL._SL1500_.jpg', 'purchase': 'https://www.amazon.com/dp/B005DKZTMG', 'price': '19'},
      {'title': 'AmazonBasics HDMI to HDMI', 'image': 'https://images-na.ssl-images-amazon.com/images/I/71TAXrJ5qmL._SL1500_.jpg', 'purchase': 'https://www.amazon.com/dp/B014I8SSD0', 'price': '7'},
      {'title': 'AmazonBasics HDMI to microHDMI', 'image': 'https://images-na.ssl-images-amazon.com/images/I/71qprGXBdwL._SL1500_.jpg', 'purchase': 'https://www.amazon.com/dp/B014I8U33I', 'price': '7'},
      {'title': 'AmazonBasics HDMI to miniHDMI', 'image': 'https://images-na.ssl-images-amazon.com/images/I/71ycz%2BorA3L._SL1500_.jpg', 'purchase': 'https://www.amazon.com/dp/B014I8UEGY', 'price': '7'},
      {'title': 'AmazonBasics HDMI to DisplayPort', 'image': 'https://images-na.ssl-images-amazon.com/images/I/71J2uGmSl3L._SL1500_.jpg', 'purchase': 'https://www.amazon.com/dp/B015OW3M1W', 'price': '11'},
    ]
  }
};
