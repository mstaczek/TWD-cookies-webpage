$(d3.csv("https://raw.githubusercontent.com/mstaczek/TWD-cookies-webpage/master/data/TimePerDayCombined.csv", d2 => {
    const pcusageData = d2;
    $('#clicksH').on("click", e => {
        updatePCUsagePlot("timeH", pcusageData);
    });
    $('#clicksA').on("click", e => {
        updatePCUsagePlot("timeA", pcusageData);
    });
    $('#clicksM').on("click", e => {
        updatePCUsagePlot("timeM", pcusageData);
    });
    $('#clicksSum').on("click", e => {
        updatePCUsagePlot("timeSum", pcusageData);
    });

    //after reading data, immediatly plot with default values
    firstUpdatePCUsagePlot(pcusageData);

    //update plot on slider change
    $("#slider-range").on("slidestop", function (event, ui) {
        updateDateOnLinePlot(pcusageData)
    })
}));


// set the dimensions and margins of the graph
let marginLinePlot = { top: 10, right: 10, bottom: 10, left: 10 },
    widthLinePlot = pltWidth - marginLinePlot.left - marginLinePlot.right,
    heightLinePlot = pltHeight - marginLinePlot.top - marginLinePlot.bottom;

// append the svg object to the body of the page
let svgLinePlot = d3.select("#lineplot1")
    .append("svg")
    .attr('viewBox', viewboxSize)
    .attr('preserveAspectRatio', 'xMinYMin')

// Add X axis --> it is a date format
var xLinearPlot = d3.scaleLinear()
    .domain([-0.5, 23.7])
    .range([0, widthLinePlot]);
svgLinePlot.append("g")
    .attr("transform", "translate(0," + heightLinePlot + ")")
    .call(d3.axisBottom(xLinearPlot));

// Add Y axis
var yLinearPlot = d3.scaleLinear()
    .domain([0, 60])
    .range([heightLinePlot, 0]);
svgLinePlot.append("g")
    .call(d3.axisLeft(yLinearPlot));

// text label for the x axis
svgLinePlot.append("text")
  .attr("transform",
    "translate(" + (widthLinePlot / 2) + " ," +
    (heightLinePlot + marginLinePlot.top + 20) + ")")
  .style("text-anchor", "middle")
  .text("Hour of a day");

// text label for the y axis
svgLinePlot.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - 50)
  .attr("x", 0 - (heightLinePlot / 2))
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .text("Minutes");

// List of possible columns
var allGroup = ["timeH", "timeA", "timeM", "timeSum"]

function sumAndToMinutes(chosenColumns, data) {
    // Calculate the sums and group data (while tracking count)
    const grouped = data.reduce(function (m, d) {
      if (!m[d.hour]) {
        m[d.hour] = { hour: parseInt(d.hour), minutes: parseInt(d[chosenColumns]), count: 1 };
        return m;
      }
      m[d.hour].minutes += parseInt(d[chosenColumns]);
      m[d.hour].count += 1;
      return m;
    }, {});
  
    // Create new array from grouped data and compute the average
    let averaged = Object.keys(grouped).map(function (k) {
      const item = grouped[k];
      return {
        hour: item.hour,
        minutes: item.minutes / (item.count * 60)
      }
    })
    return averaged
  }


function firstUpdatePCUsagePlot(data) {
    // for changing date
    d3.selectAll(".someline")
        .remove()

    let fdata = data.filter(el => filterData(el))
    for (let x in allGroup) {
        chosenColumn = allGroup[x];
        var averaged2 = sumAndToMinutes(chosenColumn, fdata)
        addLine(averaged2, chosenColumn, greycolor)
    }
    updatePCUsagePlot("timeSum", data)
}


function updatePCUsagePlot(chosenColumn, data) {
    let fdata = data.filter(el => filterData(el))
    const averaged = sumAndToMinutes(chosenColumn, fdata)
    d3.selectAll(".someline")
        .transition().delay(500).duration(500)
        .attr("stroke", greycolor)

    //"move to front" by replotting
    d3.select("." + chosenColumn)
        .remove()
    addLine(averaged, chosenColumn, bluecolor)
}


function addLine(data, columnname, color) {
    svgLinePlot
        .append("path")
        .attr("class", columnname + " someline")
        .datum(data)
        .transition().duration(500)
        .attr("d", d3.line()
            .x(function (d) { return xLinearPlot(+d.hour) })
            .y(function (d) { return yLinearPlot(+d.minutes) })
            .curve(d3.curveBasis)
        )
        .attr("stroke", color)
        .style("stroke-width", 4)
        .style("fill", "none")
}

function updateDateOnLinePlot(data) {
    let fdata = data.filter(el => filterData(el))
    for (let x in allGroup) {
        chosenColumn = allGroup[x];
        var averaged2 = sumAndToMinutes(chosenColumn, fdata)
        d3.select("." + chosenColumn)
            .datum(averaged2)
            .transition()
            .duration(1000)
            .attr("d", d3.line()
                .x(function (d) { return xLinearPlot(+d.hour) })
                .y(function (d) { return yLinearPlot(+d.minutes) })
                .curve(d3.curveBasis)
            )
    }
}