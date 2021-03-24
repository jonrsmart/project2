 // Load and munge data, then make the visualization.
 var path = "assets/data/state_cost_living.csv";
 var cost_cats = ["Overall", "Grocery", "Housing", "Utility", "Transportation",
                        "Misc"];

 d3.csv(path, function(error, data) {
     var costs = {};
     data.forEach(function(d) {
         var cats = d.State;
         costs[cats] = [];

         cost_cats.forEach(function(x) {
             costs[cats].push( +d[x] );
         });
     });
     drawChart(costs);
 });

 var drawChart = function(costs) {
     // Define dimensions of char
     var margin = { top: 30, right: 50, bottom: 30, left: 50 },
         width  = 800 - margin.left - margin.right,
         height = 400 - margin.top  - margin.bottom;

     // Make x scale
     var xScale = d3.scaleBand()
     .domain(cost_cats)
     .range([0, width])
     .padding(0.1);

     // Make y scale, the domain will be defined on bar update
     var yScale = d3.scaleLinear()
         .range([height, 0]);

     // Create chart
     var chart = d3.select("#cost_of_living")
       .append("svg")
         .attr("width",  width  + margin.left + margin.right)
         .attr("height", height + margin.top  + margin.bottom)
       .append("g")
         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

     // Make x-axis and add to chart
     var bottomAxis = d3.axisBottom(xScale);

     chart.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

    //  var xAxis = d3.svg.axis()
    //      .scale(xScale)
    //      .orient("bottom");

    //  chart.append("g")
    //      .attr("class", "x axis")
    //      .attr("transform", "translate(0," + height + ")")
    //      .call(xAxis);

     // Make y-axis and add to chart

     var leftAxis = d3.axisLeft(yScale).ticks(10);

     var updateY = chart.append("g")
                    .call(leftAxis);

    //  var yAxis = d3.svg.axis()
    //      .scale(yScale)
    //      .orient("left");

    //  var updateY = chart.append("g")
    //      .attr("class", "y axis")
    //      .call(yAxis);

    //  updateY.append("text")
    //      .attr("transform", "rotate(-90)")
    //      .attr("y", 6)
    //      .attr("dy", ".71em")
    //      .style("text-anchor", "end")
    //      .text("Value");

     var updateChart = function(data) {
         // First update the y-axis domain to match data
         yScale.domain([70, 300] );
         updateY.call(leftAxis);

         var bars = chart.selectAll(".bar").data(data);

         // Add bars for new data
         bars.enter()
           .append("rect")
             .attr("class", "bar")
             .attr("x", function(d,i) { return xScale( cost_cats[i] ); })
             .attr("width", xScale.bandwidth())
             .attr("y", function(d,i) { return yScale(d); })
             .attr("height", function(d,i) { return height - yScale(d); });

         // Update old ones, already have x / width from before
         bars
             .transition().duration(250)
             .attr("y", function(d,i) { return yScale(d); })
             .attr("height", function(d,i) { return height - yScale(d); });

         // Remove old ones
         bars.exit().remove();
     };

     // Handler for dropdown value change
     var dropdownChange = function() {
         var newState = d3.select(this).property('value'),
             newChoice   = costs[newState];

         updateChart(newChoice);
     };

     // Get names of States, for dropdown
     var States = Object.keys(costs).sort();

     var dropdown = d3.select("#cost_of_living")
         .insert("select", "svg")
         .on("change", dropdownChange);

     dropdown.selectAll("option")
         .data(States)
        .enter().append("option")
         .attr("value", function (d) { return d; })
         .text(function (d) {
             return d[0].toUpperCase() + d.slice(1,d.length); // capitalize 1st letter
         });

     var initialData = costs[States[0]];
     updateChart(initialData);
 };