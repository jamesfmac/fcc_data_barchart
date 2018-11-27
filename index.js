

//defaults for the chart
const height = 500
const width = 1000
const barWidth = 20
const title = "Some GDP Numbers"


//attach an SVG to the page to hold the chart

const chart = d3.select('#chart')
.append('svg')
.attr('height',height)
.attr('width', width)
.attr('title',title)
.attr('class', 'chart')

//test data 
var testdata = [4, 8, 15, 16, 23, 42];

var bar = chart.selectAll('rect')
.data(testdata)
.enter()
.append('rect')
.attr('width', barWidth)
.attr('height', (d)=> d*2)
.attr('x', 0)
.attr('y',0)

