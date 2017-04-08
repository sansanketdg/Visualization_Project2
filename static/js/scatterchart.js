function plot_values(filename) {

    filename = datafolder + filename;
    svg.selectAll("*").remove();

    //clean old bar graph / pie chart
    d3.select("#scatter").remove();    

    color = ["#42f47d", "#f45341", "#0C3C00","#C300FF"];

    // Load data
    d3.csv(filename, function(error, data) {

          data.forEach(function(d) {
              d.r1 = +d.r1;
              d.r2 = +d.r2;
              d.s1 = +d.s1;
              d.s2 = +d.s2;
          });

        var margin = {top: 30, right: 15, bottom: 60, left: 60}
        , width = 960 - margin.left - margin.right
        , height = 400 - margin.top - margin.bottom;
     
        var chart = d3.select('body')
      .append('svg:svg')
      .attr('width', width + margin.right + margin.left)
      .attr('height', height + margin.top + margin.bottom)
      .attr('class', 'chart')
      .attr("id", "scatter")
      .style("margin-left", "20em");

        var main = chart.append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .attr('width', width)
      .attr('height', height)
      .attr('class', 'main')  

      var xValueR, yValueR;
      if(samples_id == 0){
        console.log("sample id = 0");
        xValueR = function(d) { return d.r1;};
        yValueR = function(d) { return d.r2;};  
      }else{
        console.log("sample id = 1");
        xValueR = function(d) { return d.s1;};
        yValueR = function(d) { return d.s2;};
      }

      xScale.domain([d3.min(data, xValueR), d3.max(data, xValueR)]);
        yScale.domain([d3.min(data, yValueR), d3.max(data, yValueR)]); 

      var x = d3.scale.linear()
                  .domain([d3.min(data, xValueR), d3.max(data, xValueR)])
                  .range([ 0, width ]);
        
      var y = d3.scale.linear()
              .domain([d3.min(data, yValueR), d3.max(data, yValueR)])
              .range([ height, 0 ]);
            
      // draw the x axis
        var xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom');

        main.append('g')
      // .attr('transform', 'translate(-80,' + yScale(275) + ')')
      .attr('transform', 'translate(0,' + height + ')')
      .attr('class', 'main axis date')
      .call(xAxis);

        // draw the y axis
        var yAxis = d3.svg.axis()
      .scale(y)
      .orient('left');

        main.append('g')
      // .attr('transform', 'translate(0, 50)')
      .attr('transform', 'translate(0,0)')
      .attr('class', 'main axis date')
      .call(yAxis);

      //put labels
      main.append("text")
      .attr("transform", "rotate(-90)")
        .attr("y", left_pad-150)
        .attr("x",h-400)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .attr("id", "yLabel")
        // .text("PCA 1");

      main.append("text")
        //.attr("transform", "rotate(-20)")
        .attr("y", left_pad+240)
        .attr("x",h+300)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .attr("id", "xLabel")
        // .text("PCA 2");

      switch(parseInt(plot_type)){
        case 0:
            d3.select("#yLabel").text("PCA Component 1");
            d3.select("#xLabel").text("PCA Component 2");      
            break;
        case 1:
            d3.select("#yLabel").text("MDS Euclidian Component 1");
            d3.select("#xLabel").text("MDS Euclidian Component 2");
            break;
        case 2:
            d3.select("#yLabel").text("MDS Correlation Component 1");
            d3.select("#xLabel").text("MDS Correlation Component 2");
            break;
      }
      

        var g = main.append("svg:g"); 
        
        if(samples_id == 0){
          g.selectAll("scatter-dots")
          .data(data)
          .enter().append("svg:circle")
              .attr("cx", function (d,i) { return xScale(d.r1); } )
              .attr("cy", function (d) { return yScale(d.r2); } )
              .attr("r", 8)
              .style("fill", function(d) {
                  return color[samples_id];
              });  
        }else{
          g.selectAll("scatter-dots")
          .data(data)
          .enter().append("svg:circle")
              .attr("cx", function (d,i) { return xScale(d.s1); } )
              .attr("cy", function (d) { return yScale(d.s2); } )
              .attr("r", 8)
              .style("fill", function(d) {
                  return color[samples_id];
              });
        }
        
    });
}