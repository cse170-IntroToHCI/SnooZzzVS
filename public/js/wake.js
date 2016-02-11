
var today = new Date();
var theDay = (today.getMonth()+1)+"/"+today.getDate()+"/"+today.getFullYear();
var theHour = today.getHours() % 12;
var theMinute = today.getMinutes();
var theMeridiem = today.getHours();

function alertClick() {
    $("#cancelAlert").show('medium');
}

function successClick() {
    $("#setAlert").show('medium');
}

function dataSelect() {
    $('#datePicker')
        .datepicker({
            format: 'mm/dd/yyyy'
        });
}

window.onload = function() {
    // happiness slider
    var mySlider = new Slider("#happinessSlider", {});

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

    $("#btnShow").click(alertClick);
    $("#setBtn").click(successClick);

    $('form').submit(function() {
        $.ajax({
            type: 'POST',
            url: '/postWakeData',
            data: {
                "date": theDay,
                "hour": theHour,
                "minute": theMinute,
                "meridiem": theMeridiem,
                "wakeFeeling": mySlider.getValue()
            }
        });
        return false;
    });

    dataSelect();
    $('#datePicker').datepicker("setDate", today);
};