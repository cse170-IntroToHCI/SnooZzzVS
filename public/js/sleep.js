/**
 * Created by Emily on 2/6/2016.
 */


$(document).ready(function() {
	$("#btnShow").click(alertClick);

	dataSelect();

});

function alertClick() {
	$(".alert").show('medium');
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