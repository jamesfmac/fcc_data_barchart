
//test data 
var testdata = [
    [
      "1947-01-01",
      243.1
    ],
    [
      "1947-04-01",
      246.3
    ],
    [
      "1947-07-01",
      250.1
    ],
    [
      "1947-10-01",
      260.3
    ]]

var data = testdata


//defaults for the chart
const height = 400
const width = 800
const barMargin =30
const barWidth = ((width-barMargin) -(data.length* barMargin))  /data.length //cal bar width based on count of items
const title = "Some GDP Numbers"


//attach an SVG to the page to hold the chart

const chart = d3.select('#chart')
.append('svg')
.attr('height',height)
.attr('width', width)
.attr('title',title)
.attr('class', 'chart')



var bar = chart.selectAll('g')
.data(testdata)
.enter()
.append('g')
.append('rect')
.attr("class","bar")
.attr("data-date", (d)=>d[0])
.attr("data-gdp", (d)=>[1])
.attr('width', barWidth)
.attr('height', (d)=> d[1])
.attr('x', (d,index)=>{
    return  index *(barWidth +barMargin) +barMargin

})
.attr('y',(d)=> height - d[1])

