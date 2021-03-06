/**
 * Created by Emily on 2/6/2016.
 */

function addAlarmToPage(name) {

    var result = null;
    var scriptUrl = "/getAllAlarmData?name=" + name;
    $.ajax({
        url: scriptUrl,
        type: 'get',
        dataType: 'json',
        async: false,
        success: function(data) {
            result = data;
        }
    });
    return result;
}

var extractAlarmData = addAlarmToPage("");
var alarmLength = extractAlarmData.length;

var hourData = [];
var minuteData = [];
var meridiemData = "";
var alarmHTML = "";
var dataID = 0;

function fillData() {

    for(var i = 0; i < alarmLength; ++i) {
        hourData[i]  = extractAlarmData[i].hour;
        minuteData[i] = extractAlarmData[i].minute;
        meridiemData = extractAlarmData[i].meridiem;
        dataID++;
        // console.log(hourData[i]);
        // console.log(minuteData[i]);
        // console.log(meridiemData);
        // console.log(dataID);

        alarmHTML += '<table id="alarmTable">' + '<tbody>' + 
            '<tr class="btnDelete" data-id="' + dataID + '">' + '<td>' + 
            '<div class="btn-group" data-toggle="buttons">' + 
            '<label class="btn btn-primary active">' + 
            '<input type="radio" name="options" id="option1" autocomplete="off" checked>' + 'ON' + 
            '</label>' + '<label class="btn btn-primary">' + 
            '<input type="radio" name="options" id="option2" autocomplete="off">' + 'OFF' + 
            '</label>' + '</div>' + '</td>' + 
            '<td>' + '<button type="button" class="btn btn-default btn-lg" id="anAlarm">' 
        + hourData[i] + ":" + minuteData[i] + " " + meridiemData + '</button>' + '</td>' +
            '<td>' + '<button class="btnDelete btn btn-default" href="" onClick="deleteAlarm()">' + 
            '<span class="glyphicon glyphicon-trash"></span></button>' + 
                '</td>' + 
            '</tr>' + '</tbody>' + '</table>';
    }

    $("#alarmData").html(alarmHTML);
    
}

function deleteAlarm() {
    $('.btnDelete').on('click', function (e) {
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

window.onload = function() {

    deleteAlarm();
    fillData();

}
