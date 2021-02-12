/*
  PMP Calculator - A tool for approximating work hours spent on a project and compare with a standard PMP project lifecycle curve.
  
  Currently known issues:
    1. There is no checking/validation if the start date is after the end date or if a project starts on a weekend
	2. 5 day work weeks do not calculate 40 hours a week properly
*/
$("#projectPMPCalc div button").click(function() {

//Store start and end dates
var projectStartDate = new Date($('#projectStartDate').val());
var projectEndDate = new Date($('#projectEndDate').val());

//Subtract the end and start dates to get the days worked then convert into working days
var oneDay = 1000*60*60*24;
var projectTime = projectEndDate.getTime() - projectStartDate.getTime();
projectTime = Math.round(projectTime/oneDay);

//Remove weekends and convert days to 8 hour work days
var weekendRemover = Math.floor(projectTime/7) * 2;
projectTime = (projectTime - weekendRemover) * 8;

//Break project hours into PMP phases then display
var phaseInitiation = .13;
var phasePlanning = .24;
var phaseExecuting = .31;
var phaseMonitoring = .25;
var phaseClosing = .07;

$("#phaseInitiation").val(Math.round(projectTime * phaseInitiation));
$("#phasePlanning").val(Math.round(projectTime * phasePlanning));
$("#phaseExecuting").val(Math.round(projectTime * phaseExecuting))
$("#phaseMonitoring").val(Math.round(projectTime * phaseMonitoring));
$("#phaseClosing").val(Math.round(projectTime * phaseClosing));
$("#phaseTotal").val(projectTime);

});