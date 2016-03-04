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

function showGetWakeResult(name) {
    var result = null;
    var scriptUrl = "/getAllWakeData?name=" + name;
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

function showGetSleepResult(name) {
    var result = null;
    var scriptUrl = "/getAllSleepData?name=" + name;
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

var extractWakeData = showGetWakeResult("");
var extractSleepData = showGetSleepResult("");
var wakeLength = extractWakeData.length;
var sleepLength = extractSleepData.length;
var wakeCount = 8;
var sleepCount = 8;

var wakeData  = [];
var sleepData = [];
var averageData = [];
var dateLabel = [];

// booleans to determine which dataset has more data points
var night = 1, day = 0;

function fillData() {

    if(wakeLength < 8) {
        wakeCount = wakeLength;
    }
    if(sleepLength < 8) {
        sleepCount = sleepLength;
    }

    // check which dataset has more data points
    if(wakeLength > sleepLength) {
        day = 1;
        night = 0;
    }

    // fill wake feeling data
    for(var i = wakeLength - 1, j = 6; i > wakeLength - wakeCount; --i, --j) {
        wakeData[j]  = extractWakeData[i].wakeFeeling;
        if(day === 1) {
            dateLabel[j] = extractWakeData[i].date;
            dateLabel[j] = dateLabel[j].slice(0, 5);
            // fill average feeling data based on wakeLength
            averageData[j] = (parseInt(sleepData[j]) + parseInt(wakeData[j]))/2;
            night = 0;
        }
    }

    // fill sleep feeling data
    for(var i = sleepLength - 1, j = 6; i > sleepLength - sleepCount; --i, --j) {
        sleepData[j] = extractSleepData[i].sleepFeeling;
        if(night === 1) {
            dateLabel[j] = extractSleepData[i].date;
            dateLabel[j] = dateLabel[j].slice(0, 5);
            // fill average feeling data based on sleepLength
            averageData[j] = (parseInt(sleepData[j]) + parseInt(wakeData[j]))/2;
            day = 0;
        }
    }

    /*
    TODO - (1) redo average. (2) fix logic b/c too many for-loops. (3) x-axis buttons
     */

    //if(wakeLength > sleepLength) {
    //    dateLabel = temp;
    //    for(var i = 0; i < sleepLength; ++i) {
    //        // strip year
    //        dateLabel[i] = dateLabel[i].slice(0, 5);
    //        //averageData[i] = (parseInt(sleepData[i]) + parseInt(wakeData[i])) / 2;
    //    }
    //} else {
    //    for(var i = 0; i < wakeLength; ++i) {
    //        // strip year
    //        dateLabel[i] = dateLabel[i].slice(0, 5);
    //        //averageData[i] = (parseInt(sleepData[i]) + parseInt(wakeData[i])) / 2;
    //    }
    //}
}

$(document).ready(function() {
    fillData();
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

    var today = new Date();
    var day = today.getDate();
    var month = today.getMonth() + 1;
    // fill the x-axis
    for(var i = 0; i < 7; ++i) {
        var day_i = day + i;
        dateLabel[i] = month+"/"+day_i
    }
    dateLabel[0] = month+"/"+day;

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