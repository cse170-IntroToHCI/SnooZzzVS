var ex1ToggleCount = 0;
var ex2ToggleCount = 0;
var ex3ToggleCount = 0;
var ex4ToggleCount = 0;

var options = {
    animation: false,
    responsive: false,
    scaleFontColor: "#000",
    scaleOverride: true,
    scaleStartValue: 1,
    scaleStepWidth: 1,
    scaleSteps: 6
};

var wakeData  = [];
var sleepData = [];
var averageData = [];
var dateLabel = [];

function fillData(userSleepData, userWakeData) {
    var userSleepDataLength = userSleepData.length;
    var userSleepDataLength = userSleepData.length;

    // fill sleep data
    for(var i = 0; i < userSleepDataLength; ++i) {
        sleepData[6 - i] = userSleepData[i].sleepFeeling;
    }

    // fill wake data
    //for(var i = 0; i < userWakeDataLength; ++i) {
    //    wakeData[i] = userWakeData[i].wakeFeeling;
    //}
}

function fillDateLabel() {
    var today = new Date();
    var day = today.getDate();
    var month = today.getMonth() + 1;
    var year = today.getFullYear();
    // fill the x-axis labels with dates
    for(var i = 0; i < 7; ++i) {
        var day_i = day - i;
        if((day_i) <= 0) {
            if(--month === 0) {
                month = 12;
            }
            for(var j = 0; i < 7; ++i) {
                if(month === 4 || month === 6 || month === 9 || month === 11) {
                    day_i = 30 - j++;
                } else if(month === 2) {
                    // account for leap year
                    if((year % 4) === 0) {
                        day_i = 29 - j++;
                    } else {
                        day_i = 28 - j++;
                    }
                } else {
                    day_i = 31 - j++;
                }
                dateLabel[6 - i] = month+"/"+day_i;
            }
        } else {
            dateLabel[6 - i] = month+"/"+day_i;
        }
    }
}

var sleepDataArray = [];
$.ajax({
    type: 'GET',
    url: '/sleepData',
    async: false,
    success: function(req) {
        console.log("Finished fetching Sleep Data");
        for(var k = 0; k < req.length; k++) {
            sleepDataArray[k] = req[k];
        }
    }
});

//var wakeDataArray = $.ajax({
//    type: 'GET',
//    url: '/wakeData',
//    async: false,
//    success: function() {
//        console.log("Finished fetching Wake Data");
//    }
//}).responseText;

$(document).ready(function() {
    //fillData(sleepDataArray, wakeDataArray);
    fillData(sleepDataArray, [1,2]);
    fillDateLabel();
    var ctx = document.getElementById("LineChart").getContext("2d");

    var enableCheck = function() {
        wakeButton = document.getElementsByClassName('hB')[0].className.indexOf('enabled') != -1;
        sleepButton = document.getElementsByClassName('sB')[0].className.indexOf('enabled') != -1;
        avgButton = document.getElementsByClassName('aB')[0].className.indexOf('enabled') != -1;
        sampleButton = document.getElementsByClassName('sampleB')[0].className.indexOf('enabled') != -1;
        if (!(wakeButton)) {
            ex1ToggleCount = 0;
            $("#ex1").css("background-color", "");
            wakeChart = {};
        } else {
            ex1ToggleCount = 1;
            $("#ex1").css("background-color", "rgba(255, 215, 0, 0.7)");
            wakeChart = {
                label: "Wake Mood Trend",
                strokeColor: "gold",
                pointColor: "gold",
                pointStrokeColor: "black",
                fillColor: "transparent",
                data: wakeData
            };
        }
        if (!(sleepButton)) {
            ex2ToggleCount = 0;
            $("#ex2").css("background-color", "");
            sleepChart = {};
        } else {
            ex2ToggleCount = 1;
            $("#ex2").css("background-color", "rgba(173, 216, 230, 0.7)");
            sleepChart = {
                label: "Sleep Mood Trend",
                strokeColor: "lightblue",
                pointColor: "lightblue",
                pointStrokeColor: "black",
                fillColor: "transparent",
                data: sleepData
            };
        }
        if (!(avgButton)) {
            ex3ToggleCount = 0;
            $("#ex3").css("background-color", "");
            averageChart = {};
        } else {
            ex3ToggleCount = 1;
            $("#ex3").css("background-color", "rgba(0, 128, 0, 0.7)");
            averageChart = {
                label: "Average Mood Trend",
                strokeColor: "green",
                pointColor: "green",
                pointStrokeColor: "black",
                fillColor: "transparent",
                data: averageData
            };
        }
        if ((sampleButton)) {
            ex4ToggleCount = 0;
            $("#ex4").css("background-color", "");
            $("#ex4").css("color", "");
            sampleChart1 = {};
            sampleChart2 = {};
            sampleChart3 = {};
        } else {
            ex4ToggleCount = 1;
            $("#ex4").css("background-color", "rgba(0, 0, 0, 0.7)");
            $("#ex4").css("color", "white");
            // Sample Trends of Wake, Sleep and Average Feeling
            sampleChart1 = {
                label: "Sample Sleep Trend",
                strokeColor: "red",
                pointColor: "red",
                pointStrokeColor: "black",
                fillColor: "transparent",
                data: [2, 3, 6, 4, 1, 5, 1]
            };
            sampleChart2 = {
                label: "Sample Wake Trend",
                strokeColor: "grey",
                pointColor: "grey",
                pointStrokeColor: "black",
                fillColor: "transparent",
                data: [1, 7, 1, 7, 1, 7, 1]
            };
            sampleChart3 = {
                label: "Sample Average Graph",
                strokeColor: "purple",
                pointColor: "purple",
                pointStrokeColor: "black",
                fillColor: "transparent",
                data: [1.5, 5, 3.5, 5.5, 1, 6, 1]
            };
            wakeChart = {};
            sleepChart = {};
            averageChart = {};
        }
    };

    enableCheck();
    data = {
        labels: dateLabel,
        datasets: [
            sleepChart,
            averageChart,
            wakeChart,
            sampleChart1,
            sampleChart2,
            sampleChart3
        ]
    };
    baseChart = new Chart(ctx).Line(data, options);
    currentChart = baseChart;

    function toggleLine(t) {

        currentChart.destroy();
        if (t.className.indexOf('enabled') == -1)
            t.className += ' enabled';
        else
            t.className = t.className.replace('enabled', '');
        enableCheck();
        data = {
            labels: dateLabel,
            datasets: [
                sleepChart,
                averageChart,
                wakeChart,
                sampleChart1,
                sampleChart2,
                sampleChart3
            ]
        };
        newChart = new Chart(ctx).Line(data, options);
        currentChart = newChart;
    };

    $("#ex1").css("background-color", "rgba(255, 215,   0, 0.7)");
    $("#ex2").css("background-color", "rgba(173, 216, 230, 0.7)");
    $("#ex3").css("background-color", "rgba(0  , 128,   0, 0.7)");

    var theHB = document.getElementById("ex1");
    theHB.onclick = function() {
        toggleLine(this);
    };

    var theSB = document.getElementById("ex2");
    theSB.onclick = function() {
        toggleLine(this);
    };

    var theAB = document.getElementById("ex3");
    theAB.onclick = function() {
        toggleLine(this);
    };

    var theSampleB = document.getElementById("ex4");
    theSampleB.onclick = function() {
        toggleLine(this);
    };
});