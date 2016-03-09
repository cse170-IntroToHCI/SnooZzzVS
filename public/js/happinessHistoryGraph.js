var DEBUG = 0;
var LINE_WIDTH = 6,
    DOT_RADIUS = 9;

var data      = [ [{'date': '', 'feeling': ''}] ],
    sleepData = [],
    wakeData  = [];
//************************************************************
// Data notice the structure
//************************************************************
$.ajax({
    type: 'GET',
    url: '/sleepData',
    async: false,
    success: function(req) {
        for(var k = 0; k < req.length; ++k) {
            sleepData[k] = req[k];
        }
    }/*,
    error: function() {
        console.log("Error Fetching Sleep Data");
    }*/
});

$.ajax({
    type: 'GET',
    url: '/wakeData',
    async: false,
    success: function(req) {
        for(var k = 0; k < req.length; ++k) {
            wakeData[k] = req[k];
        }
    }/*,
    error: function() {
        console.log("Error Fetching Wake Data");
    }*/
});

// Check to fill the data array
if( !(sleepData.length === 0 && wakeData.length === 0) ) {
    data = [];
    if(DEBUG) {
        console.log(sleepData);
        console.log(wakeData);
    }
    data.push(wakeData);
    data.push(sleepData);
    console.log(data);
}
//data = 	[ //[{'x': '', 'y': ''}]
    //[{'x':'01/01/2016','y':3},{'x':'01/02/2016','y':5},{'x':'01/03/2016','y':1},{'x':'01/04/2016','y':3},{'x':'01/05/2016','y':6},{'x':'01/06/2016','y':1},{'x':'01/07/2016','y':5}],
    //[{'x':'01/01/2016','y':1},{'x':'01/02/2016','y':6},{'x':'01/03/2016','y':2},{'x':'01/04/2016','y':1},{'x':'01/05/2016','y':7},{'x':'01/06/2016','y':2},{'x':'01/07/2016','y':6}],
    //[{'x':'01/01/2016','y':2},{'x':'01/02/2016','y':7},{'x':'01/03/2016','y':3},{'x':'01/04/2016','y':2},{'x':'01/05/2016','y':5},{'x':'01/06/2016','y':3},{'x':'01/07/2016','y':7}]
//];

var colors = [
    'gold',
    'lightblue',
    'lightgreen'
];
for(var i = 0; i < data.length; ++i) {
    data[i].forEach(function (d) {
        d.date = d3.time.format("%m/%d/%Y").parse(d.date);
        d.feeling = +d.feeling;
    });
}

//************************************************************
// Create Margins and Axis and hook our zoom function
//************************************************************
var margin = {top: 20, right: 30, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// -------------------------
//var xScale = d3.scale.linear()
//    .domain([0, 8])
//    .range([0, width]);
// -------------------------
//var xScale = d3.time.scale()
//    .domain(d3.extent(data, function(d) {
//        for(var i = 0; i < data.length; ++i) {
//            return d[i].x;
//        }
//    }))
//    .range([0, width]);

if(DEBUG) {
    console.log("data[0][0]");
    console.log(data[0][0]);
    console.log(data[0][data[0].length-1].date);
}

var minDate = new Date( data[0][0].date );
var maxDate = new Date( data[0][data[0].length-1].date );

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
    //.tickSubdivide(true)
    .ticks(d3.time.day, 1)
    //.tickValues(d3.range(data[0][0].x, data[0][data[0].length-1].x))
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
    .x(xScale)
    .scaleExtent([1, 10])
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
    .attr('class','dot')
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
    // svg.select(".y.axis").call(yAxis);
    svg.selectAll('path.line').attr('d', line);

    points.selectAll('circle').attr("transform", function(d) {
        return "translate(" + xScale(d.point.date) + "," + yScale(d.point.feeling) + ")"; }
    );
}

//************************************************************
// GET request
//************************************************************
//d3.json("/sleepData").get(function(err, data) {
//    console.log("Fetching Data ... ");
//    console.log(data);
//    if (err) {
//        console.log("Error: ");
//        console.log(err);
//    }
//
//    data.forEach(function (d) {
//        d.date = d3.time.format("%x").parse(d.date);
//        d.sleepFeeling = +d.sleepFeeling;
//    });
//
//    //xScale.domain([0, d3.extent(data, function(d) { return d.x; })]);
//}); // end get request
//    //xScale.domain([0, d3.extent(data, function(d) { return d.x; })]);


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
