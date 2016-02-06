/**
 * Created by pablo on 2/2/2016.
 */
/*
var myDate = new Date();
var myDay = myDate.getDay();
var myMonth = myDate.getMonth() + 1; // January = 0, February = 1, etc...
var myYear = myDate.getFullYear();
window.alert(myDate + "\n\n" + myMonth + "/" + myDay + "/" + myYear);
*/
var randomScalingFactor = function(){ return Math.round(Math.random()*100)};
var lineChartData = {
    labels : ["January","February", "March", "April", "May"],
    datasetStroke: false,
    datasets : [
        {
            label: "Wake up Happiness",
            fillColor : "rgba(220,220,220,0.2)",
            strokeColor : "rgba(220,220,220,1)",
            pointColor : "rgba(220,220,220,1)",
            pointStrokeColor : "#fff",
            pointHighlightFill : "#fff",
            pointHighlightStroke : "rgba(220,220,220,1)",
            data : [randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor()]
        },
        {
            label: "Sleep Happiness",
            fillColor : "rgba(100,100,100,0.2)",
            strokeColor : "rgba(220,220,220,1)",
            pointColor : "rgba(0,0,0,0)",
            pointStrokeColor : "#fff",
            pointHighlightFill : "#fff",
            pointHighlightStroke : "rgba(255,0,255,0)",
            data : [randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor()]
        },
        {
            label: "Average Happiness",
            fillColor : "rgba(151,187,205,0.2)",
            strokeColor : "rgba(151,187,205,1)",
            pointColor : "rgba(151,187,205,1)",
            pointStrokeColor : "#fff",
            pointHighlightFill : "#fff",
            pointHighlightStroke : "rgba(151,187,205,1)",
            data : [randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor()]
        }
    ]
}

window.onload = function(){
    var ctx = document.getElementById("canvas").getContext("2d");
    var lineChart = window.myLine;
    lineChart = new Chart(ctx).Line(lineChartData, {
        animation: false,
        responsive: false,
        //maintainAspectRatio: false,
        //scaleFontSize: 30,
        scaleFontColor: "#000"
    });
}