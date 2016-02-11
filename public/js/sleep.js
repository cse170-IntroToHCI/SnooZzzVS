var today = new Date();
var theDay = (today.getMonth()+1)+"/"+today.getDate()+"/"+today.getFullYear();
var theHour = today.getHours() % 12;
var theMinute = today.getMinutes();
var theMeridiem = today.getHours();

$(document).ready(function() {
	$("#btnShow").click(alertClick);
	$("#setBtn").click(setClick);

	dataSelect();
	$('#datePicker').datepicker("setDate", today);

});

function alertClick() {
	$("#cancelAlert").show('medium');
}

function setClick() {
	$("#setAlert").show('medium');
}

function dataSelect() {
 	$('#datePicker')
	    .datepicker({
	        format: 'mm/dd/yyyy'
	    });
};