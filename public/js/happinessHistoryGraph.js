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


var wakeData  = [];
var sleepData = [];
var averageData = [];
var dateLabel = [];
var temp = [];
function fillData() {
    if(wakeLength > 5) {
        wakeLength = 5;
    }
    if(sleepLength > 5) {
        sleepLength = 5;
    }
    for(var i = 0; i < wakeLength; ++i) {
        wakeData[i]  = extractWakeData[i].wakeFeeling;
        temp[i] = extractWakeData[i].date;
    }

    for(var i = 0; i < sleepLength; ++i) {
        sleepData[i] = extractSleepData[i].sleepFeeling;
        dateLabel[i] = extractWakeData[i].date;
    }
    if(wakeLength > sleepLength) {
        dateLabel = temp;
        for(var i = 0; i < sleepLength; ++i) {
            averageData[i] = (parseInt(sleepData[i]) + parseInt(wakeData[i])) / 2;
        }
    } else {
        console.log("\n");
        for(var i = 0; i < wakeLength; ++i) {
            averageData[i] = (parseInt(sleepData[i]) + parseInt(wakeData[i])) / 2;
            console.log(averageData[i]);
        }
    }
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
                strokeColor: "#449bf7",
                pointColor: "#449bf7",
                fillColor: "transparent",
                data: wakeData,
            };
        }
        if (!(sadButton)) {
            sadChart = {};
        } else {
            sadChart = {
                label: "Sad History Graph",
                strokeColor: "#efb96c",
                pointColor: "#efb96c",
                fillColor: "transparent",
                data: sleepData
            };
        }
        if (!(avgButton)) {
            averageChart = {};
        } else {
            averageChart = {
                label: "Average Happiness History",
                strokeColor: "#aacdf2",
                pointColor: "#aacdf2",
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
});