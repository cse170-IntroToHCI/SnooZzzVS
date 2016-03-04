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
    var userWakeDataLength = userWakeData.length;
    var userAvgDataLength = (userSleepDataLength > userWakeDataLength) ? userWakeDataLength : userSleepDataLength;
    var secondFrontMostPointForAverage = 0;

    // fill sleep data
    for(var i = 0; i < userSleepDataLength; ++i) {
        var sleepDate_i = userSleepData[userSleepDataLength - i - 1].date.substring(1, 5);
        if(sleepDate_i === dateLabel[6 - i]) {
            sleepData[6 - i] = userSleepData[userSleepDataLength - i - 1].sleepFeeling;
        } else if((6 - (i + 1)) >= 0) {
            // start j one index more than i
            for(var j = 0; j < userSleepDataLength; ++j) {
                if(sleepDate_i === dateLabel[(6 - (i + 1)) - j]) {
                    sleepData[(6 - (i + 1)) - j] = userSleepData[(userSleepDataLength - (i + 1)) - j].sleepFeeling;
                    break;
                }
            }
        }
    }

    // fill wake data
    for(var i = 0; i < userWakeDataLength; ++i) {
        var wakeDate_i = userWakeData[userWakeDataLength - i - 1].date.substring(1, 5);
        console.log("{");
        console.log("\twakeDate_i     = " + wakeDate_i);
        console.log("\tdateLabel[6-"+i+"] = " + dateLabel[6-i]);
        console.log("}");
        if(wakeDate_i === dateLabel[6 - i]) {
            console.log("match");
            wakeData[6 - i] = userWakeData[userWakeDataLength - i - 1].wakeFeeling;
        } else if((6 - (i + 1)) >= 0) {
            // start j one index more than i
            for(var j = 0; j < userWakeDataLength; ++j) {
                var t1 = (6 - (i + 1)) - j;
                console.log("t1: " + t1);
                console.log("wD: " + wakeDate_i);
                console.log("dL: " + dateLabel[t1]);
                if(wakeDate_i === dateLabel[(6 - (i + 1)) - j]) {
                    console.log("in @ i: " + i);
                    var t2 = (userWakeDataLength - (i + 1)) - j;
                    console.log("t2: " + t2);
                    console.log("-----------");
                    wakeData[(6 - (i + 1)) - j] = userWakeData[(userWakeDataLength - (i + 1)) - j].wakeFeeling;
                    //++i;
                    secondFrontMostPointForAverage = (secondFrontMostPointForAverage > ((6 - (i + 1)) - j))
                        ? secondFrontMostPointForAverage : ((6 - (i + 1)) - j);
                    console.log("====> " + secondFrontMostPointForAverage);
                    break;
                }
            }
        }
    }

    // clean up sleepData array
    for(var k = 0; k < (7 - userSleepDataLength); ++k) {
        if(sleepData[k] === null || sleepData[k] === undefined || sleepData[k] === 0) {
            sleepData[k] = null;
        }
    }

    // clean up wakeData array
    for(var k = 0; k < (7 - userWakeDataLength); ++k) {
        if(wakeData[k] === null || wakeData[k] === undefined || wakeData[k] === 0) {
            wakeData[k] = null;
        }
    }
console.log("{");
    // fill average data
    for(var k = 0; k < userAvgDataLength; ++k) {
        var sleepData_k = parseInt(sleepData[secondFrontMostPointForAverage-k]);
        var wakeData_k = parseInt(wakeData[secondFrontMostPointForAverage-k]);
        if(sleepData_k === null || wakeData_k === null) {
            continue;
        } else {
            console.log("\t"+averageData[secondFrontMostPointForAverage-k]);
            averageData[secondFrontMostPointForAverage-k] = (sleepData_k + wakeData_k)/2;
        }
    }
    console.log("}");

    // clean up averageData array
    for(var k = 0; k < 7; ++k) {
        if(averageData[k] === null || averageData[k] === undefined || averageData[k] === 0) {
            averageData[k] = null;
        }
    }
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

                // concatentate "0" if single digit
                if(day_i.toString().length === 1) {
                    day_i = "0" + day_i;
                }
                dateLabel[6 - i] = month+"/"+day_i;
            }
        } else {
            // concatentate "0" if single digit
            if(day_i.toString().length === 1) {
                day_i = "0" + day_i;
            }
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
        for(var k = 0; k < req.length; k++) {
            sleepDataArray[k] = req[k];
        }
        console.log("Finished fetching Sleep Data");
    }
});

var wakeDataArray = [];
$.ajax({
    type: 'GET',
    url: '/wakeData',
    async: false,
    success: function(req) {
        for(var k = 0; k < req.length; k++) {
            wakeDataArray[k] = req[k];
        }
        console.log("Finished fetching Wake Data");
    }
});

$(document).ready(function() {
    fillDateLabel();
    fillData(sleepDataArray, wakeDataArray);

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