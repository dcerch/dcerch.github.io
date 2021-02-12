$('#projectIncomeSavings form :input').change(function() {
  //Used in income algorithm to convert rate
  var savingsResult = 0;
  //Savings Account Over Time
  var saot = [];
  //Days in a given interval
  var dayFrequency = {
    onemonth: 30,
    sixmonth: 182,
    oneyear: 365,
    threeyear: 1095,
    fiveyear: 1825,
    tenyear: 3650
  };
  //Months in a given interval
  var monthFrequency = {
    onemonth: 1,
    sixmonth: 6,
    oneyear: 12,
    threeyear: 36,
    fiveyear: 60,
    tenyear: 120
  };
  //Years in a given interval
  var yearFrequency = {
    onemonth: 0.08,
    sixmonth: 0.5,
    oneyear: 1,
    threeyear: 3,
    fiveyear: 5,
    tenyear: 10
  };

  //Get all income form information
  var incomePrincipal = $('#incomeFormPrincipal').val();
  var incomeRate = $('#incomeFormRate').val();
  var incomeFrequency = $('#incomeFormFrequency').find(':selected').text();

  //Format values
  incomePrincipal = round(incomePrincipal, 2);
  incomeRate = incomeRate * .01;

  //Determine which frequency was selected
  //For each interval in the frequency, get the savings results and push it to the savings account array
  switch(incomeFrequency) {
    case 'Daily':
      $.each(dayFrequency, function(key, value) {
        savingsResult = savingsOnFrequency(value, incomePrincipal, incomeRate);
        saot.push(savingsResult);
      });
      break;
    case 'Monthly':
      $.each(monthFrequency, function(key, value) {
        savingsResult = savingsOnFrequency(value, incomePrincipal, incomeRate);
        saot.push(savingsResult);
      });
      break;
    case 'Yearly':
      $.each(yearFrequency, function(key, value) {
        savingsResult = savingsOnFrequency(value, incomePrincipal, incomeRate);
        saot.push(savingsResult);
      });
      break;
  }

  //Display in table
  $('#projectIncomeSavings tbody td').each(function() {
    //Take first element, display it, then remove it
    $(this).text(saot.shift());
  });
});

//Returns total savings for a particular frequency interval
function savingsOnFrequency(frequencyInterval, principal, rate) {
  var accruedSavings = principal;

  //If savings frequency interval is 1 or greater, it means it will accrue interest. If it is less than one, the account has yet to accrue
  if(frequencyInterval >= 1) {
    for (i = 0; i < frequencyInterval; i++) {
      accruedSavings = accruedSavings * rate + accruedSavings;
    }
  }
  else {
    accruedSavings = principal;
  }

  //Return the savings account for that frequency interval, rounded and in the correct format
  return round(accruedSavings, 2).toFixed(2);
}

//Rounds numbers more effectively
function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}
