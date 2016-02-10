
$(document).ready(function() {
	$("#btnShow").click(alertClick);
	$("#setBtn").click(setClick);

	dataSelect();

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