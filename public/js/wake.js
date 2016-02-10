
var today = new Date();
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
    // todo - submit the JSON here

}

function dataSelect() {
    $('#datePicker')
        .datepicker({
            format: 'mm/dd/yyyy'
        });
}

// Sets default fields for each <select> element, except for the Happiness Slider
window.onload = function() {
    var defaultHour = document.getElementById("selectHour");
    defaultHour[theHour - 1].setAttribute("selected", "selected"); // -1 b/c array begins at zero

    var defaultMinute = document.getElementById("selectMinute");
    defaultMinute[theMinute].setAttribute("selected", "selected");

    var defaultMeridiem = document.getElementById("selectMeridiem");
    if(theMeridiem < 12) {
        defaultMeridiem[0].setAttribute("selected", "selected");
    } else {
        defaultMeridiem[1].setAttribute("selected", "selected");
    }
};