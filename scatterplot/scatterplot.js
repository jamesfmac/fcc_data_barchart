//defaults for the chart
const height = 400
const width = 800
const padding = 40
const radius = 4
const title = "Doping in Proffesional Bicycle Racing"
const timeFormat = d3.timeFormat("%M:%S");
const yearFormat = d3.timeFormat("%Y");

const chartContainer = d3.select('#chart')

//attach an SVG to the page to hold the chart

const chart = chartContainer
  .append('svg')
  .attr('height', height)
  .attr('width', width)
  .attr('title', title)
  .attr('class', 'chart')

  console.log(chartContainer)
// declare variable outside of function call for easier access when debuggin? must be a better way

let dataset= ''




  //get data and draw chart 

  fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
  .then(function (response) {
    return response.json();
  })
  .then(function (myJson) {
    dataset = myJson
    console.log(dataset)
    drawChart(dataset)
  })

  /* used for redrawing based on date range changes 
const filterDates = function (sDate, eDate) {

  drawChart(
    dataset.filter((d) => {
      return d[0] > sDate && d[0] <= eDate + 1
    })
  )
}
*/


const drawChart = function (data){

    const allTimes = data.map((d)=> {
        let parsedTime = d.Time.split(":")
       return new Date (Date.UTC(1970,0,1,0,parsedTime[0], parsedTime[1]));
       
    })

    const allYears = data.map((d)=> {
       return  d.Year
    })

    const yScale = d3.scaleTime()
    .domain([d3.max(allTimes), d3.min(allTimes)])
    .range([height - padding, padding])
   
  

    const xScale = d3.scaleLinear()
    .domain([d3.min(allYears) -1, d3.max(allYears) +1])
    .range([padding, width - padding])

    

   //adding dots 
   console.log(allTimes)
   console.log(data)
   console.log(allYears)
   var dots = chart.selectAll('g')
   
   .data(data)
   .enter()
   .append('g')
   .append('circle')
   .attr("class", "dot")
   .attr("cx", function (d,i) { return xScale(allYears[i]) })
   .attr("cy", function (d,i) { return yScale(allTimes[i]) ; })
   .attr("r", radius)
   .attr("data-xvalue", function(d,i){return allYears[i]})
   .attr("data-yvalue", function(d,i){return allTimes[i]})
   .style("fill", function(d,i) { if(d.Doping.length > 1){
     return 'red'
   }
   else {
     return 'blue'
   }; })

   drawAxis(data,xScale, yScale)

}

const drawAxis = function (data, xScale, yScale){

    const yAxis = d3.axisLeft(yScale).tickFormat(timeFormat)
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"))

    

    chart.append("g")
    .attr("id", "y-axis")
    .attr("transform", "translate("+ padding + ", 0)")
    .call(yAxis)

    chart.append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(0, " + (height - padding) + ")")
    .call(xAxis)

}
