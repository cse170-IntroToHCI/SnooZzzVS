var margin = 60,
    width = parseInt(d3.select("#graph").style("width")) - margin*2,
    height = parseInt(d3.select("#graph").style("height")) - margin*2;

var xScale = d3.time.scale()
    .range([0, width]);
    //.nice(d3.time.day);

var yScale = d3.scale.linear()
    .range([height, 0])
    .nice();

var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .ticks(1)
    .tickFormat(d3.time.format("%m/%d"));

var yAxis = d3.svg.axis()
    .scale(yScale)
    .ticks(1)
    .orient("left");

var line = d3.svg.line()
    .x(function(d) { return xScale(d.date); })
    .y(function(d) { return yScale(d.sleepFeeling); });

var zoom = d3.behavior.zoom()
    .x(xScale)
    .scaleExtent([1,10])
    .on("zoom", zoomed);

var graph = d3.select("#graph")
    .attr("width", width + margin*2)
    .attr("height", height + margin*2)
    .append("g")
    .attr("transform", "translate(" + margin + "," + margin + ")")
    .call(zoom);

d3.json("/sleepData").get(function(err, data) {
    if(err) {
        console.log("Error: ");
        console.log(err);
    }

    data.forEach(function(d) {
        d.date = d3.time.format("%x").parse(d.date);
        d.sleepFeeling = +d.sleepFeeling;
    });

    xScale.domain(d3.extent(data, function(d) { return d.date; }));
    yScale.domain(d3.extent(data, function(d) { return d.sleepFeeling; }));

    graph.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    graph.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end");

    dataPerPixel = data.length/width;
    dataResampled = data.filter(
        function(d, i) { return i % Math.ceil(dataPerPixel) == 0; }
    );

    graph.append("path")
        .datum(dataResampled)
        .attr("class", "line")
        .attr("d", line);

    var firstRecord = data[data.length-1],
        lastRecord = data[0];

    var first = graph.append("g")
        .attr("class", "first")
        .style("display", "none");

    first.append("text")
        .attr("x", -8)
        .attr("y", 4)
        .attr("text-anchor", "end")
        .text("$" + firstRecord.sleepFeeling);
    first.append("circle")
        .attr("r", 4);


    var last = graph.append("g")
        .attr("class", "last")
        .style("display", "none");

    last.append("text")
        .attr("x", 8)
        .attr("y", 4)
        .text("$" + lastRecord.sleepFeeling);
    last.append("circle")
        .attr("r", 4);

    function resize() {
        var width = parseInt(d3.select("#graph").style("width")) - margin*2,
            height = parseInt(d3.select("#graph").style("height")) - margin*2;

        xScale.range([0, width]).nice(d3.time.day);
        yScale.range([height, 0]).nice().domain([1,7]);

        if (width < 300 && height < 80) {
            graph.select('.x.axis').style("display", "none");
            graph.select('.y.axis').style("display", "none");

            graph.select(".first")
                .attr("transform", "translate(" + xScale(firstRecord.date) + "," + yScale(firstRecord.sleepFeeling) + ")")
                .style("display", "initial");

            graph.select(".last")
                .attr("transform", "translate(" + xScale(lastRecord.date) + "," + yScale(lastRecord.sleepFeeling) + ")")
                .style("display", "initial");
        } else {
            graph.select('.x.axis').style("display", "initial");
            graph.select('.y.axis').style("display", "initial");
            graph.select(".last")
                .style("display", "none");
            graph.select(".first")
                .style("display", "none");
        }

        yAxis.ticks(Math.max(height/50, 2));
        xAxis.ticks(Math.max(width/50, 2));

        graph
            .attr("width", width + margin*2)
            .attr("height", height + margin*2)

        graph.select('.x.axis')
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        graph.select('.y.axis')
            .call(yAxis);

        dataPerPixel = data.length/width;
        dataResampled = data.filter(
            function(d, i) { return i % Math.ceil(dataPerPixel) == 0; }
        );

        graph.selectAll('.line')
            .datum(dataResampled)
            .attr("d", line);

        // stroke points
        graph.append("g").selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("r", 5)
            .attr("cx", function(dd){return xScale(dd.date)})
            .attr("cy", function(dd){return yScale(dd.sleepFeeling)})
            .attr("fill", "rgba(173, 216, 230, 0.701961)")
            .attr("stroke", "black");

        // create y label
        graph.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y",0-margin)
            .attr("x",0 - (height / 2))
            .attr("dy", "3em")
            .style("text-anchor", "middle")
            .style("font-weight", "bold")
            .text("Mood Values");

        //d3.behavior.zoom()
        //    .x(xScale)
        //    .on('zoom', function() {
        //        if(true) {
        //
        //        }
        //        redrawChart();
        //    })
    }

    d3.select(window).on('resize', resize);

    resize();
}); // end get request

function zoomed() {
    graph.select(".x.axis").call(xAxis);
    graph.selectAll("path.line").attr("d", line);


}