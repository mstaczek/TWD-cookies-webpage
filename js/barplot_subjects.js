var col1;
var col2;
var col3;
var col4;
var col5;

$(d3.csv("https://raw.githubusercontent.com/mstaczek/TWD-cookies-webpage/master/data/Przedmioty-Combined.csv", d => {
    const data = d;
    $('#animateSubjectsPlot').on("click", e => {
        let oldUpperBound = upperBound
        let oldLowerBound = lowerBound
        lowerBound = 19
        upperBound = 19
        const brek = setInterval(function () {
            $("#animationdates").text("Data from: 19th December, 2020 - " + recreateDate(upperBound));
            updateBarplot(col1, col2, col3, col4, col5, data);
            upperBound += 1
            if (upperBound > 37) {
                clearInterval(brek)
                lowerBound = oldLowerBound
                upperBound = oldUpperBound
            }
        }, 500)

    });
    $('#clicksH').on("click", e => {
        updateBarplot("twdH", "isiH", "javaH", "rpH", "numH", data);
    });
    $('#clicksA').on("click", e => {
        updateBarplot("twdA", "isiA", "javaA", "rpA", "numA", data);
    });
    $('#clicksM').on("click", e => {
        updateBarplot("twdM", "isiM", "javaM", "rpM", "numM", data);
    });
    $('#clicksSum').on("click", e => {
        updateBarplot("twd", "isi", "java", "rp", "num", data);
    });
    updateBarplot("twd", "isi", "java", "rp", "num", data);

    //update plot on slider change
    $("#slider-range").on("slidestop", function (event, ui) {
        updateBarplot(col1, col2, col3, col4, col5, data);
    });
}));


// set the dimensions and margins of the graph
let marginBarplot = { top: 10, right: 10, bottom: 10, left: 10 },
    widthBarplot = pltWidth - marginBarplot.left - marginBarplot.right,
    heightBarplot = pltHeight - marginBarplot.top - marginBarplot.bottom;

// append the svg object to the body of the page
let svgBarplot = d3.select("#barplot1")
    .append("svg")
    .attr('viewBox', viewboxSize)
    .attr('preserveAspectRatio', 'xMinYMin')


// Add X axis
let xBarplotScale = d3.scaleBand().range([0, widthBarplot]).padding(0.5).domain(["TWD", "ISI", "Java", "RP", "MN"])
let xAxisBarplot = d3.axisBottom().scale(xBarplotScale);
svgBarplot.append("g")
    .attr("transform", "translate(0," + heightBarplot + ")")
    .attr("class", "myXaxis")

// Add Y axis
let yBarplotScale = d3.scaleLinear()
    .range([heightBarplot, 0]);
let yAxisBarplot = d3.axisLeft().scale(yBarplotScale);
svgBarplot.append("g")
    .attr("class", "myYaxis")

// text label for the x axis
svgBarplot.append("text")
    .attr("transform",
        "translate(" + (widthBarplot / 2) + " ," +
        (heightBarplot + marginBarplot.top + 20) + ")")
    .style("text-anchor", "middle")
    .text("Subject");

// text label for the y axis
svgBarplot.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - 50)
    .attr("x", 0 - (heightBarplot / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Time in minutes");


function updateBarplot(chosenColumnTWD, chosenColumnISI, chosenColumnJAVA, chosenColumnRP, chosenColumnNUM, data) {
    col1 = chosenColumnTWD
    col2 = chosenColumnISI
    col3 = chosenColumnJAVA
    col4 = chosenColumnRP
    col5 = chosenColumnNUM

    data = data.filter(el => filterData(el))
    let result = data.map(a => a[chosenColumnTWD]);
    sum1 = d3.sum(result)
    result = data.map(a => a[chosenColumnISI]);
    sum2 = d3.sum(result)
    result = data.map(a => a[chosenColumnJAVA]);
    sum3 = d3.sum(result)
    result = data.map(a => a[chosenColumnRP]);
    sum4 = d3.sum(result)
    result = data.map(a => a[chosenColumnNUM]);
    sum5 = d3.sum(result)
    let array = [{ name: "TWD", time: sum1 }, { name: "ISI", time: sum2 }, { name: "Java", time: sum3 }, { name: "RP", time: sum4 }, { name: "MN", time: sum5 },]

    svgBarplot.selectAll(".myXaxis")
        .transition()
        .duration(500)
        .call(xAxisBarplot);

    yBarplotScale.domain([0, d3.max(array, function (d) {
        return d.time
    })])
    svgBarplot.selectAll(".myYaxis")
        .transition()
        .duration(500)
        .call(yAxisBarplot);

    // Plot all bars
    let u = svgBarplot.selectAll(".allbars")
        .data(array);

    u.enter()
        .append("rect")
        .attr("class", "allbars")
        .merge(u)
        .transition()
        .duration(500)
        .attr("x", function (d) { return xBarplotScale(d.name); })
        .attr("y", function (d) { return yBarplotScale(d.time); })
        .attr("width", xBarplotScale.bandwidth())
        .attr("height", function (d) { return heightBarplot - yBarplotScale(d.time); })
        .attr("fill", bluecolor)

    u.exit().remove(); //removal of unused bars

}

