/**
 * Created by Emily on 2/6/2016.
 */


$(document).ready(function() {
	deleteAlarm();

});

function deleteAlarm() {
	$('button.btnDelete').on('click', function (e) {
	    e.preventDefault();
	    var id = $(this).closest('tr').data('id');
	    $('#myModal').data('id', id).modal('show');
	});

	$('#btnDelteYes').click(function () {
	    var id = $('#myModal').data('id');
	    $('[data-id=' + id + ']').remove();
	    $('#myModal').modal('hide');
	});
}


