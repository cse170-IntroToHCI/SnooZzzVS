/**
 * Created by Emily on 2/6/2016.
 */


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
	        ormat: 'mm/dd/yyyy'
	    })
	    .on('changeDate', function(e) {
	        // Revalidate the date field
	        $('#eventForm').formValidation('revalidateField', 'date');
	    });
};