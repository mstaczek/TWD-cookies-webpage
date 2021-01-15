var col12;
var col22;
var col32;
var col42;
var col52;

$(d3.csv("https://raw.githubusercontent.com/mstaczek/dataplaceholder/master/all_programs.csv", d => {
    const data = d;
    $('#clicksH').on("click", e => {
        updateVizplot("operaH", "DiscordH", "explorerH", "teamsH", "Acrord32H", data);
    });
    $('#clicksA').on("click", e => {
        updateVizplot("operaA", "discordA", "explorerA", "teamsA", "AcroRd32A", data);
    });
    $('#clicksM').on("click", e => {
        updateVizplot("operaM", "DiscordM", "explorerM", "TeamsM", "AcroRd32M", data);
    });
    $('#clicksSum').on("click", e => {
        updateVizplot("opera", "discord", "explorer", "teams", "acrobat", data);
    });
    updateVizplot("opera", "discord", "explorer", "teams", "acrobat", data);

    //update plot on slider change
    $("#slider-range").on("slidestop", function (event, ui) {
        updateVizplot(col12, col22, col32, col42, col52, data);
    });
}));


// set the dimensions and margins of the graph
let marginDataVizPlot = { top: 10, right: 10, bottom: 10, left: 10 },
widthDataVizPlot = pltWidth - marginDataVizPlot.left - marginDataVizPlot.right,
heightDataVizPlot = pltHeight - marginDataVizPlot.top - marginDataVizPlot.bottom;

// append the svg object to the body of the page
let svgDataVizPlot = d3.select("#barplot2")
    .append("svg")
    .attr('viewBox', viewboxSize)
    .attr('preserveAspectRatio', 'xMinYMin')


// Add X axis
let xVizPlotScale = d3.scaleBand().range([0, widthDataVizPlot]).padding(0.5).domain(["opera", "discord", "explorer", "teams", "acrobat"])
let xAxisVizplot = d3.axisBottom().scale(xVizPlotScale);
svgDataVizPlot.append("g")
    .attr("transform", "translate(0," + heightDataVizPlot + ")")
    .attr("class", "myXaxis")

// Add Y axis
let yVizplotScale = d3.scaleLinear()
    .range([heightDataVizPlot, 0]);
let yAxisVizplot = d3.axisLeft().scale(yVizplotScale);
svgDataVizPlot.append("g")
    .attr("class", "myYaxis")

// text label for the x axis
svgDataVizPlot.append("text")
    .attr("transform",
        "translate(" + (widthDataVizPlot / 2) + " ," +
        (heightDataVizPlot + marginDataVizPlot.top + 20) + ")")
    .style("text-anchor", "middle")
    .text("Program");

// text label for the y axis
svgDataVizPlot.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - 50)
    .attr("x", 0 - (heightDataVizPlot / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Time in minutes");


function updateVizplot(chosenColumnOpera, chosenColumndiscord, chosenColumnexplorer, chosenColumnteams, chosenColumnacrobat, data) {
    col12 = chosenColumnOpera
    col22 = chosenColumndiscord
    col32 = chosenColumnexplorer
    col42 = chosenColumnteams
    col52 = chosenColumnacrobat

    data = data.filter(el => filterData(el))
    let result = data.map(a => a[chosenColumnOpera]);
    sum1 = d3.sum(result)
    result = data.map(a => a[chosenColumndiscord]);
    sum2 = d3.sum(result)
    result = data.map(a => a[chosenColumnexplorer]);
    sum3 = d3.sum(result)
    result = data.map(a => a[chosenColumnteams]);
    sum4 = d3.sum(result)
    result = data.map(a => a[chosenColumnacrobat]);
    sum5 = d3.sum(result)
    let array = [{ name: "opera", time: sum1 }, { name: "discord", time: sum2 }, { name: "explorer", time: sum3 }, { name: "teams", time: sum4 }, { name: "acrobat", time: sum5 },]

    svgDataVizPlot.selectAll(".myXaxis")
        .transition()
        .duration(500)
        .call(xAxisVizplot);

    yVizplotScale.domain([0, d3.max(array, function (d) {
        return d.time
    })])
    svgDataVizPlot.selectAll(".myYaxis")
        .transition()
        .duration(500)
        .call(yAxisVizplot);

    // Plot all bars
    let u = svgDataVizPlot.selectAll(".allbars")
        .data(array);

    u.enter()
        .append("rect")
        .attr("class", "allbars")
        .merge(u)
        .transition()
        .duration(500)
        .attr("x", function (d) { return xVizPlotScale(d.name); })
        .attr("y", function (d) { return yVizplotScale(d.time); })
        .attr("width", xVizPlotScale.bandwidth())
        .attr("height", function (d) { return heightDataVizPlot - yVizplotScale(d.time); })
        .attr("fill", bluecolor)

    u.exit().remove(); //removal of unused bars

}

