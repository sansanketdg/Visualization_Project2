function plot_bar(filename) {

	filename = datafolder + filename;

    //clean old bar graph / pie chart
    d3.select("#scatter").remove();

	// Set the dimensions of the canvas / graph
	var margin = {top: 30, right: 50, bottom: 80, left: 100},
	    width = 960 - margin.left - margin.right,
	    height = 450 - margin.top - margin.bottom;

	// Set the ranges
 	var x = d3.scale.ordinal().rangeRoundBands([0, width]);
    var y = d3.scale.linear().range([height, 0]);

	// Define the axes
	var xAxis = d3.svg.axis().scale(x)
	    .orient("bottom").ticks(10);

	var yAxis = d3.svg.axis().scale(y)
	    .orient("left").ticks(10);
	    
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
	    	
	    	d.squared_loadings = +d.squared_loadings;
	    	console.log(d);

	    });

	    // Scale the range of the data
	    //x.domain(d3.extent(data, function(d) { return d.K; }));
  		// y.domain(d3.extent(data, function(d) { return d.k_means_score; }));
	    x.domain(data.map(function(d) { return d.attributes; }));
	    y.domain([0, d3.max(data, function(d) { return d.squared_loadings; })]);

	    // Add the X Axis
	    svg.append("g")
	        .attr("class", "x axis")
	        .attr("transform", "translate(0," + height + ")")
	        .call(xAxis)
	       .selectAll("text")
	       .attr("transform", "rotate(45)")
	        .attr("y", 0)
		    .attr("x", 9)
		    .attr("dy", ".35em")
		    .style("text-anchor", "start");

	    // Add the Y Axis
	    svg.append("g")
	        .attr("class", "y axis")
	        .call(yAxis);

	    // Add bars for bar chart
	    svg.selectAll(".bar")
	      .data(data)
	    .enter().append("rect")
	      .attr("class", "bar")
	      .attr("x", function(d) { return x(d.attributes); })
	      .attr("y", function(d) { return y(d.squared_loadings); })
	      .attr("height", function(d) { return height - y(d.squared_loadings); })
	      .attr("width", 50)
	      .attr("fill", function(d, i) { if(i < 3) return "#f45f42"; else return "#41c1f4"});

	    // Add legend
	    svg.append("circle")
	    .attr("cx", "44em")
	    .attr("cy", "0em")
        .attr("r","0.5em")
        .style("fill", "#f45f42");

        // Add label for legend
        svg.append("text")
	    .attr("x", "50.5em")
	    .attr("y", "-0.5em")
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Top 3 loaded attributes");

	    //put labels
	      svg.append("text")
	      .attr("transform", "rotate(-90)")
	        .attr("y", -70)
	        .attr("x", -100)
	        .attr("dy", "1em")
	        .style("text-anchor", "middle")
	        .attr("id", "yLabel")
	        .text("squared loadings");
	      

	      svg.append("text")
	        //.attr("transform", "rotate(-20)")
	        .attr("y", 380)
	        .attr("x", 380)
	        .attr("dy", "1em")
	        .style("text-anchor", "middle")
	        .attr("id", "xLabel")
	        .text("Attributes");

	});
}