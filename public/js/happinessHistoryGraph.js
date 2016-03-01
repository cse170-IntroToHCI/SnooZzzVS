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

function turnOffSample() {
    $("#ex4").css("background-color", "");
    $("#ex4").css("color", "");
}

function turnOffUserGraph() {
    ex1ToggleCount++;
    ex2ToggleCount++;
    ex3ToggleCount++;
}

$(document).ready(function() {
    fillData();
    var ctx = document.getElementById("LineChart").getContext("2d");

    var enableCheck = function() {
        happyButton = document.getElementsByClassName('hB')[0].className.indexOf('enabled') != -1;
        sadButton = document.getElementsByClassName('sB')[0].className.indexOf('enabled') != -1;
        avgButton = document.getElementsByClassName('aB')[0].className.indexOf('enabled') != -1;
        if (!(happyButton)) {
            happyChart = {};
        } else {
            happyChart = {
                label: "Happiness History Graph",
                strokeColor: "gold",
                pointColor: "gold",
                pointStrokeColor: "black",
                fillColor: "transparent",
                data: wakeData
            };
        }
        if (!(sadButton)) {
            sadChart = {};
        } else {
            sadChart = {
                label: "Sad History Graph",
                strokeColor: "lightblue",
                pointColor: "lightblue",
                pointStrokeColor: "black",
                fillColor: "transparent",
                data: sleepData
            };
        }
        if (!(avgButton)) {
            averageChart = {};
        } else {
            averageChart = {
                label: "Average Happiness History",
                strokeColor: "green",
                pointColor: "green",
                pointStrokeColor: "black",
                fillColor: "transparent",
                data: averageData
            };
        }
    };


    enableCheck();
    data = {
        labels: dateLabel,
        datasets: [ sadChart, averageChart, happyChart ]
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
            datasets: [ sadChart, averageChart, happyChart ]
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
        if(ex1ToggleCount % 2 === 1) {
            $(this).css("background-color", "rgba(255, 215, 0, 0.7)");

            turnOffSample();
        } else {
            $(this).css("background-color", "");
        }
        ++ex1ToggleCount;
    };

    var theSB = document.getElementById("ex2");
    theSB.onclick = function() {
        toggleLine(this);
        if(ex2ToggleCount % 2 === 1) {
            $(this).css("background-color", "rgba(173, 216, 230, 0.7)");

            turnOffSample();
        } else {
            $(this).css("background-color", "");
        }
        ++ex2ToggleCount;
    };

    var theAB = document.getElementById("ex3");
    theAB.onclick = function() {
        toggleLine(this);
        if(ex3ToggleCount % 2 === 1) {
            $(this).css("background-color", "rgba(0, 128, 0, 0.7)");

            turnOffSample();
        } else {
            $(this).css("background-color", "");
        }
        ++ex3ToggleCount;
    };

    var theSampleB = document.getElementById("ex4");
    theSampleB.onclick = function() {
        toggleLine(this);
        if(ex4ToggleCount % 2 === 1) {
            $(this).css("background-color", "");
            $(this).css("color", "");
        } else {
            // clicked "sample" data
            $(this).css("background-color", "rgba(0, 0, 0, 0.7)");
            $(this).css("color", "white");

            //turnOffUserGraph();
        }
        ++ex4ToggleCount;
    };
});