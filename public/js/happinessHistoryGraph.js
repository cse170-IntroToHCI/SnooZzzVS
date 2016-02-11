
function showGetResult( name )
{
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
var extractWakeData = showGetResult("TEST");
var length = extractWakeData.length;

var length = extractWakeData.length;
var wakeData = [
    extractWakeData[length-1].wakeFeeling,
    extractWakeData[length-2].wakeFeeling,
    extractWakeData[length-3].wakeFeeling,
    extractWakeData[length-4].wakeFeeling,
    extractWakeData[length-5].wakeFeeling,
];

var options = {
    animation: false,
    responsive: false,
    scaleFontColor: "#000",
    scaleOverride: true,
    scaleStartValue: 1,
    scaleStepWidth: 1,
    scaleSteps: 6
};

var chartlabel = [2000, 2001, 2002, 2003, 2004];
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
            data: wakeData
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
            data: [1,2,1,2,1,2]
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
            data: [7,5,3,1,6,4]
        };
    }
};


enableCheck();
data = {
    labels: chartlabel,
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
        labels: chartlabel,
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