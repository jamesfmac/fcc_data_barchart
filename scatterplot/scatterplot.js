//defaults for the chart
const height = 400
const width = 800
const padding = 40
const radius = 4
const title = "Doping in Proffesional Bicycle Racing"
const timeFormat = d3.timeFormat("%M:%S");
const yearFormat = d3.timeFormat("%Y");
var color = d3.scaleOrdinal(d3.schemeCategory10)


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

// declare variable outside of function call for easier access when debuggin? must be a better way

let dataset= ''




  //get data and draw chart 

  fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
  .then(function (response) {
    return response.json();
  })
  .then(function (myJson) {
    dataset = myJson
    populateDateDropdowns(dataset)
    drawChart(dataset)
  })


const filterDates = function (sDate, eDate) {

  drawChart(
    dataset.filter((d) => {
      return d.Year > sDate && d.Year <= eDate + 1
    })
  )
}



const populateDateDropdowns = function (dataset) {

  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  //set date range options 
  const availibleYears = dataset.map(d => parseInt(d.Year)).filter(onlyUnique).sort()
  
  
  const sDateSelect = document.getElementById("sDate");
  const eDateSelect = document.getElementById("eDate");
  const reset = document.getElementById('reset');

  sDateSelect.addEventListener("change", function (e) {
    filterDates(sDateSelect.value, eDateSelect.value)
    reset.style.display= 'inline'
    sDateSelect.blur()
  });

  eDateSelect.addEventListener("change", function (e) {
    console.log(eDateSelect.value)
    filterDates(sDateSelect.value, eDateSelect.value)
    reset.style.display= 'inline'
    eDateSelect.blur()
  });

  reset.addEventListener("click",function(d){
   
    sDateSelect.value = d3.min(availibleYears)
    eDateSelect.value = d3.max(availibleYears)
    filterDates(sDateSelect.value, eDateSelect.value)
    reset.style.display= 'none'
    

  })

  availibleYears.filter(onlyUnique).forEach(year => {

    let sOptionValue = document.createElement("option")
    sOptionValue.text = year
    sDateSelect.add(sOptionValue);

    let eOptionValue = document.createElement("option")
    eOptionValue.text = year
    eDateSelect.add(eOptionValue);

  });
  eDateSelect.value = d3.max(availibleYears)

 



}






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
   var dots = chart.selectAll('g')
   .remove()
    .exit()
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
   .style("fill", function(d,i) { return color(d.Doping !="") })

   //adding tooltips
   .on("mouseover", function (d, i) {

    tooltip.transition()
      .duration(0)
      .style("left", (d3.event.pageX) +5 + "px")
        .style("top", (d3.event.pageY - 28) + "px");
    tooltip.html("<div class='name'>" + d.Name + "</div>"+
      "<div> Year: "+ allYears[i] +"</div> " +
      "<div> Time: " +timeFormat(allTimes[i]) + "</div>"+
      "<div class = 'reason'>" + d.Doping +"</div>"
      )
      .attr("data-year", allYears[i])
      .attr("data-gdp", d[1])
      .style('opacity', 0.9)
      .attr('class', 'tooltip')



  })
  .on("mouseout", function (el) {
    tooltip.transition()
      .style("opacity", 0);
  });





   drawAxis(data,xScale, yScale)
   drawLegend()

}

const drawLegend=function (){

  //attaching the legend
     var legend = chart.selectAll(".legend")
      .data(color.domain())
      .enter().append("g")
      .attr("class", "legend")
      .attr("id", "legend")
      .attr("transform", function(d, i) {
        return "translate(0," + (height/2 - i * 20) + ")";
      });
  
    legend.append("rect")
      .attr("x", width - 24)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);
  
    legend.append("text")
      .attr("x", width - 30)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) {
        if (d) return "Riders with doping allegations";
        else {
          return "No doping allegations";
        };
      });
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
