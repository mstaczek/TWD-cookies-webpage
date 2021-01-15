// set the dimensions and margins of the graph
let marginDataVizPlot2 = { top: 10, right: 10, bottom: 10, left: 10 },
  widthDataVizPlot2 = 400 - marginDataVizPlot2.left - marginDataVizPlot2.right,
  heightDataVizPlot2 = 400 - marginDataVizPlot2.top - marginDataVizPlot2.bottom;

// append the svg object to the body of the page
let svgDataVizPlot2 = d3.select("#my_dataviz2")
  .append("svg")
  .attr('viewBox', '-50 -50 500 500')
  .attr('preserveAspectRatio', 'xMinYMin')

// get the data
d3.csv("data/data_to_page2.csv", function (data) {

  // X axis: scale and draw:
  var x = d3.scaleLinear()
    .domain([0, 300])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
    .range([0, widthDataVizPlot2]);
  svgDataVizPlot2.append("g")
    .attr("transform", "translate(0," + heightDataVizPlot2 + ")")
    .call(d3.axisBottom(x));

  // Y axis: initialization
  var y = d3.scaleLinear()
    .range([heightDataVizPlot2, 0]);
  var yAxis = svgDataVizPlot2.append("g")

  // A function that builds the graph for a specific value of bin
  function update(nBin) {

    // set the parameters for the histogram
    var histogram = d3.histogram()
      .value(function (d) { return d.numb; })   // I need to give the vector of value
      .domain(x.domain())  // then the domain of the graphic
      .thresholds(x.ticks(nBin)); // then the numbers of bins

    // And apply this function to data to get the bins
    var bins = histogram(data);

    // Y axis: update now that we know the domain
    y.domain([0, d3.max(bins, function (d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
    yAxis
      .transition()
      .duration(1000)
      .call(d3.axisLeft(y));

    // Join the rect with the bins data
    var u = svgDataVizPlot2.selectAll("rect")
      .data(bins)

    // Manage the existing bars and eventually the new ones:
    u
      .enter()
      .append("rect") // Add a new rect for each new elements
      .merge(u) // get the already existing elements as well
      .transition() // and apply changes to all of them
      .duration(1000)
      .attr("x", 1)
      .attr("transform", function (d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
      .attr("width", function (d) { return x(d.x1) - x(d.x0) - 1; })
      .attr("height", function (d) { return heightDataVizPlot2 - y(d.length); })
      .style("fill", "#69b3a2")


    // If less bar in the new histogram, I delete the ones not in use anymore
    u
      .exit()
      .remove()

  }


  // Initialize with 20 bins
  update(20)


  // Listen to the button -> update if user change it
  d3.select("#nBin").on("input", function () {
    update(+this.value);
  });

});
