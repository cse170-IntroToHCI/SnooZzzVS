var graphVisited;
var cookieFields = document.cookie.split(";");

for(field in cookieFields) {
    if(cookieFields[field].indexOf("graphVisited=") >= 0) {
        var objectField = cookieFields[field].split("=");
        graphVisited = parseInt(objectField[1]);
    }
}

$(document).ready(function() {
    if(graphVisited < 1) {
        $('#infoIcon').attr("data-original-title", "Click me!");
        $('#infoIcon').tooltip('show');
        document.cookie = "graphVisited="+ ++graphVisited;
    }
    
    $('#infoIcon').click(function() {
        $('#infoIcon').tooltip('toggle');
        $('#infoIcon').attr("data-original-title", "Toggle between the buttons and see the mood level for each category that corresponds to the color on the graph");
        $('#infoIcon').tooltip('show');
    });
});
$('#infoIcon').tooltip();

$('#weekButton').click(function (e) {
    $('#monthButton').removeClass('active');
    $('#yearButton').removeClass('active');
    $('#historyButton').removeClass('active');
});

$('#monthButton').click(function (e) {
    $('#weekButton').removeClass('active');
    $('#yearButton').removeClass('active');
    $('#historyButton').removeClass('active');
});

$('#yearButton').click(function (e) {
    $('#weekButton').removeClass('active');
    $('#monthButton').removeClass('active');
    $('#historyButton').removeClass('active');
});

$('#historyButton').click(function (e) {
    $('#weekButton').removeClass('active');
    $('#monthButton').removeClass('active');
    $('#yearButton').removeClass('active');
});

document.getElementById('logoutButton').onclick = function() {
    console.log("logging out");
    $.ajax({
        type: 'GET',
        url: '/user/logout',
        data: {},
        success: function() {
            window.location = './';
        }
    });
};
