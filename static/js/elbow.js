function plot_elbow(filename) {

	filename = datafolder + filename;
    //svg.selectAll("*").remove();

    //clean old bar graph / pie chart
    d3.select("#scatter").remove();

	// Set the dimensions of the canvas / graph
	var margin = {top: 30, right: 30, bottom: 50, left: 100},
	    width = 960 - margin.left - margin.right,
	    height = 400 - margin.top - margin.bottom;

	// Set the ranges
	var x = d3.scale.linear().range([0, width]);
	var y = d3.scale.linear().range([height, 0]);

	// Define the axes
	var xAxis = d3.svg.axis().scale(x)
	    .orient("bottom").ticks(10);

	var yAxis = d3.svg.axis().scale(y)
	    .orient("left").ticks(5);

	// Define the line
	var valueline = d3.svg.line()
	    .x(function(d) { return x(d.K); })
	    .y(function(d) { return y(d.k_means_score); });
	    
	// Adds the svg canvas
	var svg = d3.select("body")
	    .append("svg")
	        .attr("width", width + margin.left + margin.right)
	        .attr("height", height + margin.top + margin.bottom)
	        .attr("id", "scatter")
	        .style("margin-left", "20em")
	    .append("g")
	        .attr("transform", 
	              "translate(" + margin.left + "," + margin.top + ")");

	// Get the data
	d3.csv(filename, function(error, data) {
	    data.forEach(function(d) {
	    	d.K = +d.K;
	    	d.k_means_score = +d.k_means_score
	    });

	    console.log(data);
	    // Scale the range of the data
	    x.domain([0, d3.max(data, function(d) { return d.K; })]);
	    y.domain([d3.min(data, function(d) {return d.k_means_score; }), d3.max(data, function(d) { return d.k_means_score; })]);

	    // Add the valueline path.
	    svg.append("path")
	        .attr("class", "line")
	        .attr("d", valueline(data));

	    // Add the X Axis
	    svg.append("g")
	        .attr("class", "x axis")
	        .attr("transform", "translate(0," + height + ")")
	        .call(xAxis);

	    // Add the Y Axis
	    svg.append("g")
	        .attr("class", "y axis")
	        .call(yAxis);

	    //put labels
	      svg.append("text")
	      .attr("transform", "rotate(-90)")
	        .attr("y", -100)
	        .attr("x", -130)
	        .attr("dy", "1em")
	        .style("text-anchor", "middle")
	        .attr("id", "yLabel")
	        .text("Sum of squared errors");
	      

	      svg.append("text")
	        //.attr("transform", "rotate(-20)")
	        .attr("y", 350)
	        .attr("x", 350)
	        .attr("dy", "1em")
	        .style("text-anchor", "middle")
	        .attr("id", "xLabel")
	        .text("Number of Clusters (K)");

	});
}