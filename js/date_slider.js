var lowerBound = 24; //slider lower and upperbounds of selected range at the beginning
var upperBound = 31; 

function recreateDate(num) {
    if (num <= 31)
        return num + 'th December, 2020'
    num -= 31
    switch (num) {
        case 1:
            num += 'st';
            break;
        case 2:
            num += 'nd';
            break;
        case 3:
            num += 'nd';
            break;
        default:
            num += 'th';
            break;
    }
    return num + ' January, 2021';
}

$(function () {
    $("#slider-range").slider({
        range: true,
        min: 19,
        max: 37,
        values: [lowerBound, upperBound],
        slide: function (event, ui) {
            $("#dateRange").text("Days range:" + recreateDate(ui.values[0]) + " - " + recreateDate(ui.values[1]));
            lowerBound = ui.values[0]
            upperBound = ui.values[1]
        }
    });
    $("#dateRange").text("Days range:" + recreateDate($("#slider-range").slider("values", 0)) +
        " - " + recreateDate($("#slider-range").slider("values", 1)));

    lowerBound = $("#slider-range").slider("values", 0)
    upperBound = $("#slider-range").slider("values", 1)
});
