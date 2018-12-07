
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


  let rawDates=[]
  let years = []
  let quarters = []
  let datSet = []




//defaults for the chart
const height = 400
const width = 800
const padding = 40

const title = "Some GDP Numbers"

const chartContainer = d3.select('#chart')

//attach an SVG to the page to hold the chart

const chart = chartContainer
  .append('svg')
  .attr('height', height)
  .attr('width', width)
  .attr('title', title)
  .attr('class', 'chart')

const tooltip = d3.select('#chart')
  .append('div')
  .attr('class', 'tooltip')
  .attr('id', 'tooltip')


function getOffset(el) {
  const rect = el.getBoundingClientRect();
  return {
    left: rect.left + window.scrollX,
    top: rect.top + window.scrollY
  };
}



//TODO call to fetch the data will go here 


fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
  .then(function (response) {
    return response.json();
  })
  .then(function (myJson) {
     dataset = myJson.data

     rawDates = dataset.map(d => new Date(d[0]))
     years = dataset.map (d => d[0].substring(0,4))
     quarters = dataset.map ((d)=>{
       let temp = d[0].substring(5,7)
      if (temp==01){
        return "Q1"
      }
      if (temp == 04){
        return "Q2"
      }
      if (temp ==07){
        return "Q3"
      }
      if (temp ==10) {
        return "Q4"
      }
    })

    const GDP = dataset.map(d => d[1])

    //transformers to make sure the element fits inside the box 

    const barWidth = (width - padding * 2) / dataset.length;

    const xScale = d3.scaleTime()
      .range([padding, width - padding])
      .domain([d3.min(rawDates), d3.max(rawDates)])


    const yScale = d3.scaleLinear()
      .domain([0, d3.max(dataset, (d) => d[1])])
      .range([height - padding, padding]);


    //adding bars 
    var bar = chart.selectAll('g')
      .data(dataset)
      .enter()
      .append('g')
      .append('rect')
      .attr("class", "bar")
      .attr("data-date", (d) => d[0])
      .attr("data-gdp", (d) => d[1])

      .attr('width', barWidth)
      .attr('height', (d) => (height - padding) - yScale(d[1]))

      .attr('y', (d) => yScale(d[1]))
      .attr('x', (d, i) => padding + i * barWidth)
      .on('mouseover', function (d, i) { })


      //adding tooltips
      .on("mouseover", function (d, i) {
        tooltip.transition()
        .duration(0)
          .style('left', getOffset(chartContainer._groups[0][0]).left + padding * 1.5 + (i + 1) * barWidth)
          .style('top', getOffset(chartContainer._groups[0][0]).top + 0.7 * height)
        tooltip.html(years[i] +' '+ quarters[i] + '<br>' + '$' + GDP[i].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + ' Billion')
          .attr("data-date", d[0])
          .attr("data-gdp", d[1])
          .style('opacity', 0.9)



      })
      .on("mouseout", function (el) {
        tooltip.transition()
          .style("opacity", 0);
      });

    //adding the axis
    const xAxis =
      d3.axisBottom(xScale)
        .ticks(d3.timeYear.every(5))

    chart.append("g")
      .attr("id", "x-axis")
      .attr("transform", "translate(0, " + (height - padding) + ")")
      .call(xAxis)


    const yAxis = d3.axisLeft(yScale);

    chart.append("g")
      .attr("id", "y-axis")
      .attr("transform", "translate(" + padding + ",0)")
      .call(yAxis);
    let ticks = d3.selectAll(".tick text");
    ticks.attr("class", "tick")

  })

