
//window.onload = function() {
    var ctx = document.getElementById("LineChart").getContext("2d");

    var options = {
        animation: false,
        responsive: false,
        scaleFontColor: "#000"
    };

    var chartlabel = [2000, 2001, 2002, 2003, 2004];

    var enableCheck = function() {
        happyButton = document.getElementsByClassName('hB')[0].className.indexOf('enabled') != -1;
        sadButton = document.getElementsByClassName('sB')[0].className.indexOf('enabled') != -1;
        avgButton = document.getElementsByClassName('aB')[0].className.indexOf('enabled') != -1;
        if (!(happyButton)) {
            happyChart = {};
        } else {
            happyChart = {
                label: "NCREIF Property Index Annual Returns",
                strokeColor: "#449bf7",
                pointColor: "#449bf7",
                fillColor: "transparent",
                data: [11.72, 7.10, 6.58, 8.70, 13.77, 18.72]
            };
        }
        if (!(sadButton)) {
            sadChart = {};
        } else {
            sadChart = {
                label: "S&P 500 Avg. Annual % Change in Value",
                strokeColor: "#efb96c",
                pointColor: "#efb96c",
                fillColor: "transparent",
                data: [0, 1, 0, 1, 0, 1]
            };
        }
        if (!(avgButton)) {
            averageChart = {};
        } else {
            averageChart = {
                label: "NCREIF Average Return",
                strokeColor: "#aacdf2",
                pointColor: "#aacdf2",
                fillColor: "transparent",
                data: [2,4,6,8,10,12]
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
//};