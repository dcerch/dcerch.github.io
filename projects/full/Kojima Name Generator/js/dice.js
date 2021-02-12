//Set random function
function dice(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

/* NUMBER SECTION [s1a]: Determining How Many Names You Have
Kojima often creates characters that have many alternate names, so we must first figure out how many names you will have.
*/

//Set dice for condition and category
var s1a = dice(6);
var s2a = 1;
var s2b = 1;
var s2c = 1;
var s2d = 1;
var s3a = 1;
var s3b = 1;
var s3c = 1;
var s3d = 1;
var s3e = 1;
var s3f = 1;
var s3g = 1;
var s3h = 1;

//Sections that need to be re-rolled
function rollDice() {
  /* CONDITION SECTION [s2a, s2b, s2c, s2d]: Determining Your Name Conditions
  Sometimes, a character will have a plot-based condition that affects their name.
  You, too, might have a condition that affects your name.
  Conditions can stack, so please make note of how many your name has.
  */
  s2a = dice(4); //the -man condition
  s2b = dice(8); //the condition condition
  s2c = dice(12); //the clone condition
  s2d = dice(100); //the Kojima condition

  /* CATEGORY SECTION [s3a]: Determining Your Name Category
  Kojima names fall into a finite number of categories. This section will determine the category in which your name belongs.
  NOTE: If you have a name + 6 alternate names, you will do this section once to find your true name, and then you will have an alternate name in every other category.
  */
  s3a = dice(20);

  /* CATEGORY SUB-SECTION [s3b]: Normal Name
  Kojima's early work includes lots of characters that have names that are widely considered to be "normal."
  Was this just because, in the early years, he didn't have the power to say, "I'm Hideo Kojima, I can name someone Die-Hardman if I want to" without people questioning him? Probably.
  */
  s3b = 1;

  /* CATEGORY SUB-SECTION [s3c]: Occupational Name
  Kojima's characters tend to be driven by the work that they do.That often carries over to their names. You, too, can be nothing more than your job.
  */
  s3c = dice(4);

  /* CATEGORY SUB-SECTION [s3d]: Horny Name
  Kojima's characters and stories are irrevocably horny. Weirdly horny, sure, but horny nonetheless.
  */
  s3d = dice(4);

  /* CATEGORY SUB-SECTION [s3e]: The Name
  Kojima loves to make people have names that start with the word "The" and they usually symbolize fears or unstoppable forces. You are now that unstoppable force.
  */
  s3e = dice(4);

  /* CATEGORY SUB-SECTION [s3f]: Cool Name
  Kojima loves to be cool. Sometimes, his idea of cool is a bit strange, but it is always cool to Hideo Kojima, and that’s what matters.
  */
  s3f = dice(6);

  /* CATEGORY SUB-SECTION [s3g]: Violent Name
  Sometimes, a Kojima name can be very threatening and violent, like Sniper Wolf, or The Fury. Now you can also be threatening and violent.
  */
  s3g = dice(4);

  /* CATEGORY SUB-SECTION [s3h]: Name That Lacks Subtext
  Sometimes, Kojima gives up and just names a character exactly what they are. Congratulations. You are exactly what you do.
  */
  s3h = 1;
}
