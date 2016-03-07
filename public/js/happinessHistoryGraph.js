
//************************************************************
// Data notice the structure
//************************************************************
var data = 	[
    [{'x':1,'y':0},{'x':2,'y':5},{'x':3,'y':10},{'x':4,'y':0},{'x':5,'y':6},{'x':6,'y':11},{'x':7,'y':9},{'x':8,'y':4},{'x':9,'y':11},{'x':10,'y':2}],
    [{'x':1,'y':1},{'x':2,'y':6},{'x':3,'y':11},{'x':4,'y':1},{'x':5,'y':7},{'x':6,'y':12},{'x':7,'y':8},{'x':8,'y':3},{'x':9,'y':13},{'x':10,'y':3}],
    [{'x':1,'y':2},{'x':2,'y':7},{'x':3,'y':12},{'x':4,'y':2},{'x':5,'y':8},{'x':6,'y':13},{'x':7,'y':7},{'x':8,'y':2},{'x':9,'y':4},{'x':10,'y':7}]
];

var colors = [
    'steelblue',
    'green',
    'red',
    'purple'
];


//************************************************************
// Create Margins and Axis and hook our zoom function
//************************************************************
var margin = {top: 20, right: 30, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var xScale = d3.scale.linear()
    .domain([0, 12])
    .range([0, width]);

var yScale = d3.scale.linear()
    .domain([-1, 16])
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(xScale)
    .tickSize(-height)
    .tickPadding(10)
    .tickSubdivide(true)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(yScale)
    .tickPadding(10)
    .tickSize(-width)
    .tickSubdivide(true)
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
    .attr("y", (-margin.left) + 10)
    .attr("x", -height/2)
    .text('Axis Label');

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


////************************************************************
//// Resizing updates
////************************************************************
//function resize() {
//    var width = parseInt(d3.select("#graph").style("width")) - margin*2,
//        height = parseInt(d3.select("#graph").style("height")) - margin*2;
//
//    xScale.range([0, width]).nice(d3.time.year);
//    yScale.range([height, 0]).nice();
//
//    //if (width < 300 && height < 80) {
//    //    svg.select('.x.axis').style("display", "none");
//    //    svg.select('.y.axis').style("display", "none");
//    //
//    //    svg.select(".first")
//    //        .attr("transform", "translate(" + xScale(firstRecord.date) + "," + yScale(firstRecord.close) + ")")
//    //        .style("display", "initial");
//    //
//    //    svg.select(".last")
//    //        .attr("transform", "translate(" + xScale(lastRecord.date) + "," + yScale(lastRecord.close) + ")")
//    //        .style("display", "initial");
//    //} else {
//    //    svg.select('.x.axis').style("display", "initial");
//    //    svg.select('.y.axis').style("display", "initial");
//    //    svg.select(".last")
//    //        .style("display", "none");
//    //    svg.select(".first")
//    //        .style("display", "none");
//    //}
//
//    yAxis.ticks(Math.max(height/50, 2));
//    xAxis.ticks(Math.max(width/50, 2));
//
//    svg
//        .attr("width", width + margin*2)
//        .attr("height", height + margin*2)
//
//    svg.select('.x.axis')
//        .attr("transform", "translate(0," + height + ")")
//        .call(xAxis);
//
//    svg.select('.y.axis')
//        .call(yAxis);
//
//    //dataPerPixel = data.length/width;
//    //dataResampled = data.filter(
//    //    function(d, i) { return i % Math.ceil(dataPerPixel) == 0; }
//    //);
//
//    svg.selectAll('.line')
//        .datum(dataResampled)
//        .attr("d", line);
//}
//
//d3.select(window).on('resize', resize);
//
//resize();

var chart = $("#graph"),
    aspect = chart.width() / chart.height(),
    container = chart.parent();
$(window).on("resize", function() {
    var targetWidth = container.width();
    chart.attr("width", targetWidth);
    chart.attr("height", Math.round(targetWidth / aspect));
}).trigger("resize");
