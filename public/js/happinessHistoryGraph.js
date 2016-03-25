//************************************************************
// Initialize Variables
//************************************************************
var DEBUG = 0;
var LINE_WIDTH = 6,
    DOT_RADIUS = 9;

// Graph stroke arrays
var data      = [],
    sleepData = [],
    wakeData  = [],
    averageData = [],
    sampleData1 = [],
    sampleData2 = [],
    sampleData3 = [];

// Colors for graph strokes
var colors = [
    'gold',
    'lightblue',
    'green',
    'red',
    'orange',
    'purple'
], uniqueIdForLines = [
    'wakeLine',
    'sleepLine',
    'averageLine',
    'sampleLine1',
    'sampleLine2',
    'sampleLine3'
], uniqueClassForPoints = [
    'wakePoints',
    'sleepPoints',
    'averagePoints',
    'samplePoints',
    'samplePoints',
    'samplePoints'
];

// Toggle booleans for graph strokes
var toggleWakeLine    = 1,
    toggleSleepLine   = 1,
    toggleAverageLine = 1,
    toggleSampleLines = 0;  // turned off by default

//************************************************************
// Init properties
//************************************************************
$("#ex1").css("background-color", "");
$("#ex2").css("background-color", "");
$("#ex3").css("background-color", "");

// Init-Sample-Data
var thisYear = new Date().getFullYear();
var newYearsDay = new Date("01/01/"+thisYear);
var nextNewYearsDay = new Date("01/01/"+parseInt(thisYear+1));

for(var day_i = newYearsDay; day_i < nextNewYearsDay; day_i.setDate(day_i.getDate() + 1)) {
    var tempDate = parseInt(day_i.getMonth()+1)+"/"+day_i.getDate()+"/"+day_i.getFullYear();
    var dataForSampleOne = {
        date: tempDate,
        feeling: Math.floor(Math.random() * (8 - 1) + 1)
    };
    sampleData1.push(dataForSampleOne);

    var dataForSampleTwo = {
        date: tempDate,
        feeling: Math.floor(Math.random() * (8 - 1) + 1)
    };
    sampleData2.push(dataForSampleTwo);

    var dataForSampleThree = {
        date: tempDate,
        feeling: (dataForSampleOne.feeling + dataForSampleTwo.feeling)/2
    };
    sampleData3.push(dataForSampleThree);
}

if(DEBUG) {
    console.log(sampleData1);
    console.log(sampleData2);
    console.log(sampleData3);
}
// END Init-Sample-Data

//************************************************************
// Request the Sleep/Wake Data
//************************************************************
$.ajax({
    type: 'GET',
    url: '/sleepData',
    async: false,
    success: function(req) {
        for(var k = 0; k < req.length; ++k) {
            sleepData[k] = req[k];
        }
    }
});

$.ajax({
    type: 'GET',
    url: '/wakeData',
    async: false,
    success: function(req) {
        for(var k = 0; k < req.length; ++k) {
            wakeData[k] = req[k];
        }
    }
});

//************************************************************
// Calculate Average Data
//************************************************************
var sleepDataObject = sleepData.reduce(function(map, obj) {
    map[obj.date] = obj.feeling;
    return map;
}, {});

var wakeDataObject = wakeData.reduce(function(map, obj) {
    map[obj.date] = obj.feeling;
    return map;
}, {});

if(DEBUG) {
    console.log(sleepDataObject);
    console.log("---------------");
    console.log(wakeDataObject);
    console.log("---------------");
}

for(dateKey in sleepDataObject) {
    var wakeFeeling = parseInt(wakeDataObject[dateKey]);
    var sleepFeeling = parseInt(sleepDataObject[dateKey]);
    var averageFeeling = (wakeFeeling + sleepFeeling)/2;
    averageData.push({
        date: dateKey,
        feeling: averageFeeling
    });

    if(DEBUG) {
        console.log(wakeFeeling);
        console.log("*************");
        console.log(sleepFeeling);
    }
}

var tempAverageArray = [];
for(var dateKey = 0; dateKey < averageData.length; ++dateKey) {
    if(!(isNaN(averageData[dateKey].feeling))) {
        tempAverageArray.push(averageData[dateKey]);
    }
}
averageData = tempAverageArray;

//************************************************************
// Fill Data array
//************************************************************
$("#ex1").css("background-color", "gold");
$("#ex2").css("background-color", "lightblue");
$("#ex3").css("background-color", "green");
if(!DEBUG) {
    console.log("Sleep Data\n",sleepData);
    console.log("Wake  Data\n",wakeData);
}

//if(wakeData.length === 0) {
//    var tempWakeDataPoint = {
//        date: '01/01/1980',
//        feeling: 5
//    };
//    wakeData.push(tempWakeDataPoint);
//}
//
//if(sleepData.length === 0) {
//    var tempSleepDataPoint = {
//        date: '01/01/1980',
//        feeling: 3
//    };
//    sleepData.push(tempSleepDataPoint);
//}

// Finalize the data array which contains all graph strokes
data.push(wakeData);
data.push(sleepData);
data.push(averageData);

data.push(sampleData1);
data.push(sampleData2);
data.push(sampleData3);

// format Date data
for(var i = 0; i < data.length; ++i) {
    data[i].forEach(function (d) {
        if(DEBUG === 1 && i === 0) {
            //d.date = new Date();
            console.log("d.date", d.date);
            console.log("^year ", new Date(d.date));
            //d.date = new Date(d.date);
        }
        //d.date = d3.time.format("%m/%d/%Y").parse(d.date);
        d.date = d3.time.format("%a %b %d %Y %I:%M").parse(d.date);
        d.feeling = +d.feeling;
    });
}

if(DEBUG) {
    console.log("Filling Data Array done.");
    console.log(data);
}

//************************************************************
// Calculate min/max Date for the default view of the graph
//************************************************************
var minWakeDate,
    minSleepDate,
    maxWakeDate,
    maxSleepDate;

// Check if sleep data is empty
if(sleepData.length !== 0) {
    minSleepDate = new Date(data[1][0].date);
    maxSleepDate = new Date(data[1][data[1].length - 1].date);
}

// Check if wake data is empty
if(wakeData.length !== 0) {
    minWakeDate  = new Date(data[0][0].date);
    maxWakeDate  = new Date(data[0][data[0].length - 1].date);
}

// select the min/max dates based on earliest/latest dates in data[0] and data[1]
var minDate = (minWakeDate > minSleepDate) ? minSleepDate : minWakeDate;
var maxDate = (maxWakeDate < maxSleepDate) ? maxSleepDate : maxWakeDate;

// these dates are used for the default view of the zoom view
var oneDay = 24*60*60*1000;
var minDateForZoom = minDate.getTime() - oneDay;
var maxDateForZoom = maxDate.getTime() + oneDay;

//************************************************************
// Create Margins and Axis and hook our zoom function
//************************************************************
var margin = {top: 20, right: 30, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var xScale = d3.time.scale()
    .nice(d3.time.day)
    .domain([minDate,maxDate])
    .range([0, width]);

var yScale = d3.scale.linear()
    .domain([0.5, 7.5])
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(xScale)
    .tickSize(-height)        // gives me the vertical grid lines
    .tickPadding(10)            // created padding from x-axis and label
    .ticks(d3.time.day, 1)
    .tickFormat(d3.time.format("%m/%d"))
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(yScale)
    //.tickPadding(10)
    .tickSize(-width)   // gives me the horizontal grid lines
    .tickSubdivide(true)
    .ticks(7)
    .orient("left");


var zoom = d3.behavior.zoom()
    .x(xScale.domain([minDateForZoom, maxDateForZoom]))
    //.x(xScale.domain([new Date("01/01/2016"), new Date("01/01/2017")]))
    .scaleExtent([1, 100])    // controls the zoom
    .on("zoom", zoomed);

//************************************************************
// Generate our SVG object
//************************************************************
var svg = d3.select("#graph")//.append("svg")
    .call(zoom)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

if(DEBUG) {
    console.log("BEFORE");
    console.log(height);
}
svg.append("g")
    .attr("class", "x axis")
    //.attr("transform", "translate("+ZERO+"," + height + ")")
    .attr("transform", "translate(0," + height + ")")
    .style("stroke", "black")
    //.style("stroke-width", 0)
    .style("font-size", "22px")
    .call(xAxis);

svg.append("g")
    .attr("class", "y axis")
    .style("stroke", "black")
    //.style("stroke-width", 0)
    .style("font-size", "20px")
    .call(yAxis);

svg.append("g")
    .attr("class", "y axis")
    .append("text")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("y", (-margin.left) + 20)
    .attr("x", -height/2 - 40)
    .style("stroke", "black")
    //.style("stroke-width", 0)
    .style("font-size", "20px")
    .text('Mood Level');

svg.append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height);


//************************************************************
// Create D3 line object and draw data on our SVG object
//************************************************************
var line = d3.svg.line()
    .interpolate("linear")
    .x(function(d) { return xScale(d.date); })
    .y(function(d) { return yScale(d.feeling); });

svg.selectAll('.line')
    .data(data)
    .enter()
    .append("path")
    .attr("id", function(d,i) {
        return uniqueIdForLines[i%uniqueIdForLines.length];
    })
    .attr("class", "line")
    .attr("clip-path", "url(#clip)")
    .attr('stroke', function(d,i){
        return colors[i%colors.length];
    })
    .attr("d", line)
    .style("stroke-width", LINE_WIDTH);


//************************************************************
// Draw points on SVG object based on the data given
//************************************************************
var points = svg.selectAll('.dots')
    .data(data)
    .enter()
    .append("g")
    .attr("class", "dots")
    .attr("clip-path", "url(#clip)");

points.selectAll('.dot')
    .data(function(d, index){
        var a = [];
        d.forEach(function(point,i){
            a.push({'index': index, 'point': point});
        });
        return a;
    })
    .enter()
    .append('circle')
    .attr('class', function(d,i) {
        classes = uniqueClassForPoints[d.index%uniqueClassForPoints.length]+" dot";
        return classes;
    })
    .attr("r", DOT_RADIUS)
    .attr('fill', function(d,i){
        return colors[d.index%colors.length];
    })
    .attr("transform", function(d) {
        if(DEBUG) {
            console.log("LOOK HERE");
            console.log(d);
        }
        return "translate(" + xScale(d.point.date) + "," + yScale(d.point.feeling) + ")"; }
    )
    .style("stroke", "black")
    .style("stroke-width", 3);


//************************************************************
// Zoom specific updates
//************************************************************
function zoomed() {
    svg.select(".x.axis").call(xAxis);
    svg.selectAll('path.line').attr('d', line);

    points.selectAll('circle').attr("transform", function(d) {
        return "translate(" + xScale(d.point.date) + "," + yScale(d.point.feeling) + ")"; }
    );
}

//************************************************************
// Resizing updates
//************************************************************
var chart = $("#graph"),
    aspect = chart.width() / chart.height(),
    container = chart.parent();
$(window).on("resize", function() {
    var targetWidth = container.width();
    chart.attr("width", targetWidth);
    chart.attr("height", Math.round(targetWidth / aspect));
}).trigger("resize");

//************************************************************
// Toggle Graphs
//************************************************************
function toggleTheWakeLine() {
    toggleWakeLine = (toggleWakeLine === 1) ? 0 : 1;
    d3.select("#wakeLine").style("opacity", toggleWakeLine);
    if(toggleWakeLine) {
        $("#ex1").css("background-color", "gold");
        d3.selectAll(".wakePoints").style("visibility", "visible");
    } else {
        $("#ex1").css("background-color", "");
        d3.selectAll(".wakePoints").style("visibility", "hidden");
    }
}

function toggleTheSleepLine() {
    toggleSleepLine = (toggleSleepLine === 1) ? 0 : 1;
    d3.select("#sleepLine").style("opacity", toggleSleepLine);
    if(toggleSleepLine) {
        $("#ex2").css("background-color", "lightblue");
        d3.selectAll(".sleepPoints").style("visibility", "visible");
    } else {
        $("#ex2").css("background-color", "");
        d3.selectAll(".sleepPoints").style("visibility", "hidden");
    }
}

function toggleTheAverageLine() {
    toggleAverageLine = (toggleAverageLine === 1) ? 0 : 1;
    d3.select("#averageLine").style("opacity", toggleAverageLine);
    if(toggleAverageLine) {
        $("#ex3").css("background-color", "green");
        d3.selectAll(".averagePoints").style("visibility", "visible");
    } else {
        $("#ex3").css("background-color", "");
        d3.selectAll(".averagePoints").style("visibility", "hidden");
    }
}

// Sample Data is turned off by default
d3.select("#sampleLine1").style("opacity", toggleSampleLines);
d3.select("#sampleLine2").style("opacity", toggleSampleLines);
d3.select("#sampleLine3").style("opacity", toggleSampleLines);
d3.selectAll(".samplePoints").style("visibility", "hidden");
function toggleTheSampleLines() {
    toggleSampleLines = (toggleSampleLines === 1) ? 0 : 1;
    d3.select("#sampleLine1").style("opacity", toggleSampleLines);
    d3.select("#sampleLine2").style("opacity", toggleSampleLines);
    d3.select("#sampleLine3").style("opacity", toggleSampleLines);
    if(toggleSampleLines) {
        $("#ex4").css("color", "white");
        $("#ex4").css("background-color", "black");
        d3.selectAll(".samplePoints").style("visibility", "visible");
    } else {
        $("#ex4").css("color", "");
        $("#ex4").css("background-color", "");
        d3.selectAll(".samplePoints").style("visibility", "hidden");
    }
}

//************************************************************
// Re-Center the graph
//************************************************************
function reset() {
    console.log("Resetting");

    // code below changes the zoom window
    //console.log(minDate);
    //console.log(maxDate);
    //var t =new Date("02/28/2016");
    //var t2=new Date("03/10/2016");
    //console.log(t);
    zoom.x(xScale.domain([minDateForZoom, maxDateForZoom]));
    zoomed();
    /*
                        For "VIEW BY" Buttons

        If I want to make the "View By" Month/Year/History Buttons I need to
        - format the x axis because the dates overlap each other
        - change the scaleExtent([]) <- has to change with each button press
        - change the zoom.x(xScale.domain([])); <- has to change with each button press
     */

}

//************************************************************
// Click Listeners
//************************************************************
$("#ex1").click(toggleTheWakeLine);
$("#ex2").click(toggleTheSleepLine);
$("#ex3").click(toggleTheAverageLine);
$("#ex4").click(toggleTheSampleLines);

$("#centerButton").click(reset);
