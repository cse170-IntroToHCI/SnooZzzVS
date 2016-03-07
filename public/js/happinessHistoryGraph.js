
//************************************************************
// Data notice the structure
//************************************************************
var data = 	[
    [{'x':'01/01/2016','y':0},{'x':'01/02/2016','y':5},{'x':'01/03/2016','y':1},{'x':'01/04/2016','y':0},{'x':'0/05/2016','y':6},{'x':'01/06/2016','y':1},{'x':'01/07/2016','y':5}],
    [{'x':'01/01/2016','y':1},{'x':'01/02/2016','y':6},{'x':'01/03/2016','y':2},{'x':'01/04/2016','y':1},{'x':'0/05/2016','y':7},{'x':'01/06/2016','y':2},{'x':'01/07/2016','y':6}]
];
data.push([{'x':'01/01/2016','y':2},{'x':'01/02/2016','y':7},{'x':'01/03/2016','y':3},{'x':'01/04/2016','y':2},{'x':'01/05/2016','y':5},{'x':'01/06/2016','y':3},{'x':'01/07/2016','y':7}]
);
var colors = [
    'steelblue',
    'green',
    'red',
    'purple'
];
for(var i = 0; i < data.length; ++i) {
    data[i].forEach(function (d) {
        d.x = d3.time.format("%x").parse(d.x);
        d.y = +d.y;
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

var xScale = d3.time.scale()
    .range([0, width]);

var yScale = d3.scale.linear()
    .domain([1, 7])
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(xScale)
    //.tickSize(-height) // gives me the horizontal grid lines
    .tickPadding(10)
    //.tickSubdivide(true)
    //.ticks(1)
    .tickFormat(d3.time.format("%x"))
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(yScale)
    //.tickPadding(10)
    //.tickSize(-width)   // gives me the horizontal grid lines
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

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

svg.append("g")
    .attr("class", "y axis")
    .append("text")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("y", (-margin.left) + 20)
    .attr("x", -height/2)
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
    .x(function(d) { return xScale(d.x); })
    .y(function(d) { return yScale(d.y); });

svg.selectAll('.line')
    .data(data)
    .enter()
    .append("path")
    .attr("class", "line")
    .attr("clip-path", "url(#clip)")
    .attr('stroke', function(d,i){
        return colors[i%colors.length];
    })
    .attr("d", line);




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
    .attr("r", 2.5)
    .attr('fill', function(d,i){
        return colors[d.index%colors.length];
    })
    .attr("transform", function(d) {
        return "translate(" + xScale(d.point.x) + "," + yScale(d.point.y) + ")"; }
    );


//************************************************************
// Zoom specific updates
//************************************************************
function zoomed() {
    svg.select(".x.axis").call(xAxis);
    // svg.select(".y.axis").call(yAxis);
    svg.selectAll('path.line').attr('d', line);

    points.selectAll('circle').attr("transform", function(d) {
        return "translate(" + xScale(d.point.x) + "," + yScale(d.point.y) + ")"; }
    );
}

//************************************************************
// GET request
//************************************************************
/*d3.json("/sleepData").get(function(err, data) {
    if (err) {
        console.log("Error: ");
        console.log(err);
    }

    data.forEach(function (d) {
        d.date = d3.time.format("%x").parse(d.date);
        d.sleepFeeling = +d.sleepFeeling;
    });

    //xScale.domain([0, d3.extent(data, function(d) { return d.x; })]);
});*/ // end get request
//xScale.domain(d3.extent(data, function(d) { return d.x; }));


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
