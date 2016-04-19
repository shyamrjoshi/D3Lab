var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
	 xcol = 1, // active x column
     ycol = 1; // active y column
//setup x and y	  
 var x = d3.scale.linear().range([0, width]);
 var y = d3.scale.linear().range([height, 0]);
 var xAxis = d3.svg.axis().scale(x).orient("bottom");
 var yAxis = d3.svg.axis().scale(y).orient("left");
// setup fill color
var cValue = function(d) { return d.origin;},
    color = d3.scale.category10();

// add the graph canvas to the body of the webpage
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// add the tooltip area to the webpage
var tooltip = d3.select("h4").append("hovered")
    .attr("class", "tooltip")
    .style("opacity", 0);
 var setTitle = function(text) {
   var content = text || '\xa0';
   $('#hovered').text(content);
 };
// load data
d3.csv("car.csv", function(error, data) {

 var headers = Object.keys(data[0]).slice(1, -1);
// Dynamic dropdown menu
   $("select").each(function(_, dropdown) {
     $.each(headers, function(_, name) {
       $(dropdown).append($("<option></option>").attr("value",name).text(name));
     });
   });
   var xLabel = svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end");
   var yLabel = svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end");
// display the scatterplot  
   var scatterPlotDisplay = function(filterMin, filterMax) {
     var xCol = $("#xaxis").val();
     var yCol = $("#yaxis").val();
     var min = filterMin || Number.MIN_VALUE;
     var max = filterMax || Number.MAX_VALUE;
     var filteredData = data.filter(function(car) {
       return +car.mpg >= min && +car.mpg <= max;
     });
     x.domain(d3.extent(filteredData, function(d) { return +d[xCol]; })).nice();
     y.domain(d3.extent(filteredData, function(d) { return +d[yCol]; })).nice();
     svg.selectAll("g .x.axis").call(xAxis);
     svg.selectAll("g .y.axis").call(yAxis);
     xLabel.text(xCol);
     yLabel.text(yCol);
     var dots = svg.selectAll(".dot").data(filteredData);
     var t = d3.transition().duration(200).style("opacity", .9);
     dots.transition()
         .attr("cx", function(d) { return x(+d[xCol]); })
         .attr("cy", function(d) { return y(+d[yCol]); })
		 .duration(1000).style("opacity", .9);
     dots.enter()
         .append("circle")
         .attr("class", "dot")
         .attr("r", 3.5)
		 .style("fill", function(d) { return color(cValue(d));}) 
         .attr("cx", function(d) { return x(+d[xCol]); })
         .attr("cy", function(d) { return y(+d[yCol]); })
         .on("mouseover", function(d) { setTitle(d['name']) })
         .on("mouseout", function(d) { setTitle() });
     dots.exit().remove();
   };
   $('select').each(function(_, dropdown) {
     $(dropdown).change(function() { scatterPlotDisplay() });
   });
   // display updated plot after selection of range in query mpg
   $("#update").click(function() {
     var min = +$("#mpg-min").val();
     var max = +$("#mpg-max").val();
     scatterPlotDisplay(min, max);
   });
   scatterPlotDisplay(); 
  // draw legend
  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
  // draw legend colored rectangles
  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);
  // draw legend text
  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d;}) 
});



