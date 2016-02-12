
// default Form values
var today = new Date();
var theDay = (today.getMonth()+1)+"/"+today.getDate()+"/"+today.getFullYear();
var theHour = today.getHours() % 12; // scale = [0 - 23]. (13 = 1pm)
var theMinute = today.getMinutes();
var theMeridiem = today.getHours();

function alertClick() {
    $("#cancelAlert").show('medium');
}

function successClick() {
    $("#setAlert").show('medium');
}

window.onload = function() {
    // Calendar
    var datePicker = $('#datePicker').datepicker({format: 'mm/dd/yyyy'});
    datePicker.datepicker("setDate", today);

    // happiness slider
    var mySlider = new Slider("#happinessSlider", {});

    var defaultHour = document.getElementById("selectHour");
    if(theHour - 1 === -1) {
        theHour = 13;
    }
    defaultHour[theHour - 1].setAttribute("selected", "selected"); // -1 b/c array begins at zero

    var defaultMinute = document.getElementById("selectMinute");
    defaultMinute[theMinute].setAttribute("selected", "selected");

    var defaultMeridiem = document.getElementById("selectMeridiem");
    if(theMeridiem < 12) {
        defaultMeridiem[0].setAttribute("selected", "selected");
    } else {
        defaultMeridiem[1].setAttribute("selected", "selected");
    }

    $('form').submit(function() {

        // current Form values
        var dayValue = $("#selectDate").val();
        var hourValue = $("#selectHour").val();
        var minuteValue = $("#selectMinute").val();
        var meridiemValue = $("#selectMeridiem").val();

        $("#setAlert").show('medium');

        // Change page layout

        var newCalendarHTML = "<h3><span class='label label-info'>"+dayValue+"</span></h3>";
        var newTimeHTML = "<h3><span class='label label-info'>"+hourValue+":"+minuteValue+" "+meridiemValue+"</span></h3>";

        $("#calendarContainer").html(newCalendarHTML);
        $("#wakingUpAtH4").html("You woke up at:");
        $("#clockContainer").html(newTimeHTML);
        $("#iAmFeelingH4").html("");
        $("#sliderContainer").html("");

        var setButton = $("#setBtn");
        setButton.html("Edit");
        setButton.attr("type", "button");
        setButton.attr("onclick", "location='/wake'");

        var cancelButton = $("#btnShow");
        cancelButton.html("Home");
        cancelButton.attr("onclick", "location='/index'");

        $("#cancelAlert").hide();
        setTimeout(function() {
            $("#setAlert").fadeOut();
        }, 2000);

        // ----- EDITING LAYOUT ENDS HERE -----

        // Post data to JSON
        $.ajax({
            type: 'POST',
            url: '/postWakeData',
            data: {
                "date": dayValue,
                "hour": hourValue,
                "minute": minuteValue,
                "meridiem": meridiemValue,
                "wakeFeeling": mySlider.getValue()
            }
        });

        return false;
    });

    // Button Click Functions
    $("#btnShow").click(alertClick);
};