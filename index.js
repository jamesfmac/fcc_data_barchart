
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

var dataset = testdata


//defaults for the chart
const height = 400
const width = 800
const padding = 40
var barWidth = (width - padding * 2) / dataset.length;
const title = "Some GDP Numbers"

//transformers to make sure the element fits inside the box 

const xScale = d3.scaleBand()
  .range([padding, width - padding])
  .domain(dataset.map((d) => d[0]))

const yScale = d3.scaleLinear()
  .domain([0, d3.max(dataset, (d) => d[1])])
  .range([height - padding, padding]);




//attach an SVG to the page to hold the chart

const chart = d3.select('#chart')
  .append('svg')
  .attr('height', height)
  .attr('width', width)
  .attr('title', title)
  .attr('class', 'chart')

d3.select('#chart')
.append('div')
.attr('class', 'tooltip')
  





//TODO call to fetch the data will go here 



var bar = chart.selectAll('g')
  .data(dataset)
  .enter()
  .append('g')
  .append('rect')
  .attr("class", "bar")
  .attr("data-date", (d) => d[0])
  .attr("data-gdp", (d) => [1])

  .attr('width', barWidth - 1)
  .attr('height', (d) => (height - padding) - yScale(d[1]))

  .attr('y', (d) => yScale(d[1]))
  .attr('x', (d, i) => padding + i * barWidth)
  .on('mouseover', function(d,i){})

  /*
  //adding tooltips
  .on("mouseover", function (d) {
    bar.append("div")
    .attr('y', (height-padding)-20)
    .text('Tooltip')

      
  })
  .on("mouseout", function (d) {
    div.transition()
      .style("opacity", 0);
  });
*/

//adding axis
const xAxis = d3.axisBottom(xScale);

chart.append("g")
  .attr("id", "x-axis")
  .attr("transform", "translate(0, " + (height - padding) + ")")
  .call(xAxis);

const yAxis = d3.axisLeft(yScale);

chart.append("g")
  .attr("id", "y-axis")
  .attr("transform", "translate(" + padding + ",0)")
  .call(yAxis);
let ticks = d3.selectAll(".tick text");
  ticks.attr("class", "tick")


