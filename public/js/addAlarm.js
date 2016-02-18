/**
 * Created by Emily on 2/6/2016.
 */

$(document).ready(function() {
	addAlarm();
	showAlarm();

});

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
    document.getElementById("newAlarm").innerHTML = text;
}


window.onload = function() {


    $('form').submit(function() {

	 	// current Form values
	    var hourValue = $("#selectHour").val();
	    var minuteValue = $("#selectMinute").val();
	    var meridiemValue = $("#selectMeridiem").val();

        // Post data to JSON
        $.ajax({
            type: 'POST',
            url: '/postAlarmData',
            data: {
                "hour": hourValue,
                "minute": minuteValue,
                "meridiem": meridiemValue
            }
        });

        return false;
    });

};
