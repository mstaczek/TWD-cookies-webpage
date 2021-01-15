//plot sizes and colors setup
var pltWidth = 420;
var pltHeight = 250;
var viewboxSize = '-50 -30 490 300'
const greycolor = '#D8D8D8'
const bluecolor = '#3340FF'


//buttons setup
function changeButtonColors(buttonid) {
    document.getElementById('clicksH').style.backgroundColor = "#FFFFFF"
    document.getElementById('clicksA').style.backgroundColor = "#FFFFFF"
    document.getElementById('clicksM').style.backgroundColor = "#FFFFFF"
    document.getElementById('clicksSum').style.backgroundColor = "#FFFFFF"
    document.getElementById(buttonid).style.backgroundColor = "#d6e4ff"
}
changeButtonColors("clicksSum")

$('#clicksH').on("click", e => {
    changeButtonColors("clicksH")
})
$('#clicksA').on("click", e => {
    changeButtonColors("clicksA")
})
$('#clicksM').on("click", e => {
    changeButtonColors("clicksM")
})
$('#clicksSum').on("click", e => {
    changeButtonColors("clicksSum")
})



// navbar menu setup for small screens
function openNav() {
    var x = document.getElementById("navDemo");
    if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
    } else {
        x.className = x.className.replace(" w3-show", "");
    }
}
