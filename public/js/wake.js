
var flipFlop = false;

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
    // preserving html to flipflop
    var preserveCalendar = $("#calendarContainer").html(),
        preserveClock = $("#clockContainer").html(),
        preserveSlider = $("#sliderContainer").html(),
        preserveTest = $("#mainForm").html();

    alertClick;

    // Calendar
    var datePicker = $('#datePicker').datepicker({format: 'mm/dd/yyyy'});
    datePicker.datepicker("setDate", today);

    // happiness slider
    var mySlider = new Slider("#happinessSlider", {});

    var defaultHour = document.getElementById("selectHour");
    if(theHour === 12 || theHour === 0) {
        theHour = 11;
    } else if(theHour >= 13) {
        theHour -= 12;
    } else {
        --theHour;
    }
    defaultHour[theHour].setAttribute("selected", "selected"); // -1 b/c array begins at zero

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
        var moodValue = mySlider.getValue();

        // Post data to JSON
        $.ajax({
            type: 'GET',
            url: '/wakeData/search?date='+dayValue,
            success: function(req) {
                // Data Not Found
                if(req === null || req === undefined || req === "") {
                    // Post data to JSON
                    $.ajax({
                        type: 'POST',
                        url: '/wakeData',
                        data: {
                            "date": dayValue,
                            "hour": hourValue,
                            "minute": minuteValue,
                            "meridiem": meridiemValue,
                            "feeling": mySlider.getValue()
                        },
                        success: function() {
                            $("#setAlert").show('medium');
                            $("#btnShow").hide();

                            //************************************************************
                            // Update Page Layout
                            //************************************************************
                            var newCalendarHTML = "<h3><span class='label label-info'>"+dayValue+"</span></h3>";
                            var newTimeHTML = "<h3><span class='label label-info'>"+hourValue+":"+minuteValue+" "+meridiemValue+"</span></h3>";
                            var newFeelingHTML = "<h3><span class='label label-info'>"+moodValue+"</span></h3><br>";

                            $("#calendarContainer").html(newCalendarHTML);
                            $("#wakeingAtH4").html("You went to wakeData at:");
                            $("#clockContainer").html(newTimeHTML);
                            $("#sliderContainer").html("<h4>Your mood level was:</h4>" + newFeelingHTML);


                            var setButton = $("#setBtn");
                            setButton.html("Edit")
                                .attr("id", "editBtn")
                                .attr("type", "button");

                            flipFlop = true;
                            // ----- EDITING LAYOUT ENDS HERE -----
                        }
                    });
                    // Data already Exists
                } else {
                    $("#myModal").modal('show');
                    $("#yesReplaceLog").click(function() {
                        $("#myModal").modal('hide');

                        $.ajax({
                            type: 'PUT',
                            url: '/wakeData',
                            data: {
                                date: $("#selectDate").val(),
                                hour: $("#selectHour").val(),
                                minute: $("#selectMinute").val(),
                                meridiem: $("#selectMeridiem").val(),
                                feeling: $("#happinessSlider").val()
                            },
                            success: function() {
                                //alert("Log Updated!"); todo - button code below in here
                                $("#setAlert").show('medium');
                                $("#btnShow").hide();

                                //************************************************************
                                // Update Page Layout
                                //************************************************************
                                var newCalendarHTML = "<h3><span class='label label-info'>"+dayValue+"</span></h3>";
                                var newTimeHTML = "<h3><span class='label label-info'>"+hourValue+":"+minuteValue+" "+meridiemValue+"</span></h3>";
                                var newFeelingHTML = "<h3><span class='label label-info'>"+moodValue+"</span></h3><br>";

                                $("#calendarContainer").html(newCalendarHTML);
                                $("#wakingUpAtH4").html("You woke up at:");
                                $("#clockContainer").html(newTimeHTML);
                                $("#sliderContainer").html("<h4>Your mood level was:</h4>" + newFeelingHTML);

                                var setButton = $("#setBtn");
                                setButton.html("Edit")
                                    .attr("id", "editBtn")
                                    .attr("type", "button");

                                flipFlop = true;
                                // ----- EDITING LAYOUT ENDS HERE -----
                            }
                        });
                    });
                }
            }
        });

        return false;
    });

    $("#setBtn").click(function() {
        if(flipFlop === true) {
            $("#setAlert").hide('medium');
            $("#wakingUpAtH4").html("Waking up at:");
            $("#clockContainer").html(preserveClock);
            $("#sliderContainer").html(preserveSlider);

            $(this).html("Update")
                .attr("id", "editBtn")
                .attr("type", "button");

            new Slider("#happinessSlider", {});
            flipFlop = 2;
        } else if(flipFlop === 2) {
            $.ajax({
                type: 'PUT',
                url: '/wakeData',
                data: {
                    date: $("#calendarContainer h3 span").html(),
                    hour: $("#selectHour").val(),
                    minute: $("#selectMinute").val(),
                    meridiem: $("#selectMeridiem").val(),
                    feeling: $("#happinessSlider").val()
                },
                success: function() {
                    $("#wakeUpdateSuccessModal").modal('show');
                }
            });
        }
    });

    $("#okayButton").click(function() {
        window.location = './index';
    });
};