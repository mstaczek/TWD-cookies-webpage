let colnameScatterplot = "clicksSum"

$(d3.csv("https://raw.githubusercontent.com/mstaczek/dataplaceholder/master/ClicksPerHourCombined.csv", d1 => {
  const clicksData = d1;
  $('#clicksH').on("click", e => {
    colnameScatterplot = "clicksH";
    updateScatterplot("clicksH", clicksData);
  });
  $('#clicksA').on("click", e => {
    colnameScatterplot = "clicksA";
    updateScatterplot("clicksA", clicksData);
  });
  $('#clicksM').on("click", e => {
    colnameScatterplot = "clicksM";
    updateScatterplot("clicksM", clicksData);
  });
  $('#clicksSum').on("click", e => {
    colnameScatterplot = "clicksSum";
    updateScatterplot("clicksSum", clicksData);
  });

  //after reading data, immediatly plot with default values
  updateScatterplot("clicksSum", clicksData);

  //update plot on slider change
  $("#slider-range").on("slidestop", function (event, ui) {
    updateScatterplot(colnameScatterplot, clicksData)
  })
}));


// set the dimensions and margins of the graph
let marginScatterplot = { top: 10, right: 10, bottom: 10, left: 10 },
  widthScatterplot = pltWidth - marginScatterplot.left - marginScatterplot.right,
  heightScatterplot = pltHeight - marginScatterplot.top - marginScatterplot.bottom;

// append the svg object to the body of the page
let svgScatterplot = d3.select("#scatterplot1")
  .append("svg")
  .attr('viewBox', viewboxSize)
  .attr('preserveAspectRatio', 'xMinYMin')


// Add X axis
let xScatterplotScale = d3.scaleLinear()
  .domain([-0.5, 23.7])
  .range([0, widthScatterplot])
let xAxisScatterplot = d3.axisBottom().scale(xScatterplotScale);
svgScatterplot.append("g")
  .attr("transform", "translate(0," + heightScatterplot + ")")
  .attr("class", "myXaxis")

// Add Y axis
let yScatterplotScale = d3.scaleLinear()
  .range([heightScatterplot, 0]);
let yAxisScatterplot = d3.axisLeft().scale(yScatterplotScale);
svgScatterplot.append("g")
  .attr("class", "myYaxis")

// text label for the x axis
svgScatterplot.append("text")
  .attr("transform",
    "translate(" + (widthScatterplot / 2) + " ," +
    (heightScatterplot + marginScatterplot.top + 20) + ")")
  .style("text-anchor", "middle")
  .text("Hour of a day");

// text label for the y axis
svgScatterplot.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - 50)
  .attr("x", 0 - (heightScatterplot / 2))
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .text("Number of changes");



function filterData(el) {
  let day = parseInt(el.day)
  if (day <= 6) {
    day += 31
  }
  return lowerBound <= day && day <= upperBound
}

function averageData(chosenColumns, data) {
  // Calculate the sums and group data (while tracking count)
  const grouped = data.reduce(function (m, d) {
    if (!m[d.hour]) {
      m[d.hour] = { hour: parseInt(d.hour), clicks: parseInt(d[chosenColumns]), count: 1 };
      return m;
    }
    m[d.hour].clicks += parseInt(d[chosenColumns]);
    m[d.hour].count += 1;
    return m;
  }, {});

  // Create new array from grouped data and compute the average
  let averaged = Object.keys(grouped).map(function (k) {
    const item = grouped[k];
    return {
      hour: item.hour,
      clicks: item.clicks / item.count
    }
  })

  return averaged
}


function updateScatterplot(chosenColumns, data) {

  data = data.filter(el => filterData(el))

  svgScatterplot.selectAll(".myXaxis")
    .transition()
    .duration(1000)
    .call(xAxisScatterplot);

  yScatterplotScale.domain(d3.extent(data, function (d) { return +d[chosenColumns] * 1.05; }))
  svgScatterplot.selectAll(".myYaxis")
    .transition()
    .duration(1000)
    .call(yAxisScatterplot);


  // Plot all dots
  var u = svgScatterplot.selectAll(".alldots")
    .data(data);

  u.enter()
    .append("circle")
    .attr("class", "alldots")
    .merge(u)
    .transition()
    .duration(500)
    .attr("cx", function (d) { return xScatterplotScale(d.hour); })
    .attr("cy", function (d) { return yScatterplotScale(d[chosenColumns]); })
    .attr("r", 3)
    .style("fill", greycolor)

  u.exit().remove(); //removal of unused dots if data.lenght < num of dots


  const averaged = averageData(chosenColumns, data)

  // Plot averaged dots
  var u = svgScatterplot.selectAll(".maindots")
    .data(averaged)
    .raise();

  u.enter()
    .append("circle")
    .attr("class", "maindots")
    .merge(u)
    .transition()
    .duration(500)
    .attr("cx", function (d) { return xScatterplotScale(d.hour); })
    .attr("cy", function (d) { return yScatterplotScale(d.clicks); })
    .attr("r", 4)
    .style("fill", bluecolor)

}
