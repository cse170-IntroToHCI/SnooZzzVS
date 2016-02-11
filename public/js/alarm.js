/**
 * Created by Emily on 2/6/2016.
 */


$(document).ready(function() {
	deleteAlarm();
	addAlarm();
	showAlarm();
	newAlarm();

});

function deleteAlarm() {
	$('button.btnDelete').on('click', function (e) {
	    e.preventDefault();
	    var id = $(this).closest('tr').data('id');
	    $('#myModal').data('id', id).modal('show');
	});

	$('#btnDeleteYes').click(function () {
	    var id = $('#myModal').data('id');
	    $('[data-id=' + id + ']').remove();
	    $('#myModal').modal('hide');
	});
}

function addAlarm() {
	// $('button.addButton').on('click', function (e) {
	//     e.preventDefault();

	// });
	$('#myModal').on('shown.bs.modal', function () {
  		$('#myInput').focus()
	});
}

function showAlarm() {
    var hour = document.getElementById("selectHour");
    var minutes = document.getElementById("selectMinute");
    var meridiem = document.getElementById("selectMeridiem");
    var text = '<p>' + hour.options[hour.selectedIndex].text + ':' + 
    minutes.options[minutes.selectedIndex].text + ' ' + 
    meridiem.options[meridiem.selectedIndex].text + '<p>';
    // document.getElementById("test").innerHTML = hour.options[hour.selectedIndex].text;
    // document.getElementById("test").innerHTML = minutes.options[minutes.selectedIndex.text];
    document.getElementById("newAlarm").innerHTML = text;
}

function addAlarmToPage() {
	// var hour = document.getElementById("selectHour");
 //    // var minutes = document.getElementById("selectMinute");
 //    // var meridiem = document.getElementById("selectMeridiem");
 //    // var text = '<p>' + hour.options[hour.selectedIndex].text + ':' + 
 //    // minutes.options[minutes.selectedIndex].text + ' ' + 
 //    // meridiem.options[meridiem.selectedIndex].text + '<p>';
	// //document.getElementById("testAlarm").innerHTML = text;
	// document.getElementById("test").innerHTML = hour.options[hour.selectedIndex].text;
	var HTML = "./alarm";
	document.getElementById("")

}
