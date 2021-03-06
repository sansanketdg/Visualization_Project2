function plot_scree(filename) {

	filename = datafolder + filename;

    //clean old bar graph / pie chart
    d3.select("#scatter").remove();

	// Set the dimensions of the canvas / graph
	var margin = {top: 30, right: 20, bottom: 50, left: 100},
	    width = 960 - margin.left - margin.right,
	    height = 400 - margin.top - margin.bottom;

	// Set the ranges
	var x = d3.scale.linear().range([0, width]);
	var y = d3.scale.linear().range([height, 0]);

	// Define the axes
	var xAxis = d3.svg.axis().scale(x)
	    .orient("bottom").ticks(10);

	var yAxis = d3.svg.axis().scale(y)
	    .orient("left").ticks(10);

	// Define the line
	var valueline = d3.svg.line()
	    .x(function(d) { return x(d.PCA_components); })
	    .y(function(d) { return y(d.eigan_values); });
	    
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
	    	d.eigan_values = +d.eigan_values;
	    	d.PCA_components = +d.PCA_components;
	    });

	    console.log(data);
	    // Scale the range of the data
	    //x.domain(d3.extent(data, function(d) { return d.K; }));
  		// y.domain(d3.extent(data, function(d) { return d.k_means_score; }));
	    x.domain([0, d3.max(data, function(d) { return d.PCA_components; })]);
	    y.domain([d3.min(data, function(d) {return d.eigan_values; }), d3.max(data, function(d) { return d.eigan_values; })]);

	    // Add the X Axis
	    svg.append("g")
	        .attr("class", "x axis")
	        .attr("transform", "translate(0," + height + ")")
	        .call(xAxis);

	    // Add the Y Axis
	    svg.append("g")
	        .attr("class", "y axis")
	        .call(yAxis);

	    // Add bars
	    svg.selectAll(".bar")
	      .data(data)
	    .enter().append("rect")
	      .attr("class", "bar")
	      .attr("x", function(d) { return x(d.PCA_components); })
	      .attr("y", function(d) { return y(d.eigan_values); })
	      .attr("height", function(d) { return height - y(d.eigan_values); })
	      .attr("width", 30)
	      .attr("fill", "#f4a641");

	    // Add the valueline path.
	    svg.append("path")
	        .attr("class", "line")
	        .attr("d", valueline(data));

	    // Add threshould line
	    svg.append("g")
	       .attr("transform", "translate(0, "+y(1)+")")
	       .append("line")
	       .attr("x2", width)
	       .style("stroke", "#2ecc71")
	       .style("stroke-width", "3px");

	    // Add legend
	    svg.append("circle")
	    .attr("cx", "26em")
	    .attr("cy", "0em")
        .attr("r","0.4em")
        .style("fill", "#2ecc71");

        // Add label for legend
        svg.append("text")
	    .attr("x", "30em")
	    .attr("y", "-0.5em")
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("PCA threshold");

	    //put labels
	      svg.append("text")
	      .attr("transform", "rotate(-90)")
	        .attr("y", -70)
	        .attr("x", -130)
	        .attr("dy", "1em")
	        .style("text-anchor", "middle")
	        .attr("id", "yLabel")
	        .text("Eigan values");

	      svg.append("text")
	        //.attr("transform", "rotate(-20)")
	        .attr("y", 350)
	        .attr("x", 350)
	        .attr("dy", "1em")
	        .style("text-anchor", "middle")
	        .attr("id", "xLabel")
	        .text("PCA components");

	});
}