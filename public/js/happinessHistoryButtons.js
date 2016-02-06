/**
 * Created by pablo on 2/4/2016.
 */

var homeButton = document.getElementById("homeButton");
homeButton.onclick = function() {
    window.location = "./";
};


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