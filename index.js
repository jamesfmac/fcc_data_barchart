
let rawDates = []
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

let xScale = ''

//Fetch the data and draw chart

fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
  .then(function (response) {
    return response.json();
  })
  .then(function (myJson) {
    dataset = myJson.data
    drawChart(dataset)
    populateDateDropdowns(dataset)
  })

const filterDates = function (sDate, eDate) {

  drawChart(
    dataset.filter((d) => {
      return d[0] > sDate && d[0] <= eDate + 1
    })
  )

}

const populateDateDropdowns = function (dataset) {

  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  //set date range options 
  const availibleYears = dataset.map(d => d[0].substring(0, 4))
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

const drawChart = function (dataset) {
  chart.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -40)
    .attr('y', 60)
    .text('Gross Domestic Product');

  rawDates = dataset.map(d => new Date(d[0]))
  years = dataset.map(d => d[0].substring(0, 4))
  quarters = dataset.map((d) => {
    let temp = d[0].substring(5, 7)
    if (temp == 01) {
      return "Q1"
    }
    if (temp == 04) {
      return "Q2"
    }
    if (temp == 07) {
      return "Q3"
    }
    if (temp == 10) {
      return "Q4"
    }
  })

  let minDate = d3.min(years)
  let maxDate = d3.max(years)

  const GDP = dataset.map(d => d[1])

 /*
  //update date range heading 
  if (document.getElementById('selectedDateRange')) {
    document.getElementById('selectedDateRange').childNodes[0].nodeValue = minDate + " - " + maxDate
    console.log('found')
  }
  else {
    let dateRange = document.createElement("H2")
    dateRange.id = "selectedDateRange"
    dateRange.appendChild(document.createTextNode(minDate + " - " + maxDate))

    document.getElementById('chart-heading').appendChild(dateRange)
  }
  */
  





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
    .remove()
    .exit()
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
    .attr('x', (d, i) => xScale(rawDates[i]))
    .on('mouseover', function (d, i) { })


    //adding tooltips
    .on("mouseover", function (d, i) {

      tooltip.transition()
        .duration(0)
        .style('left', getOffset(chartContainer._groups[0][0]).left + padding * 1.5 + (i + 1) * barWidth)
        .style('top', getOffset(chartContainer._groups[0][0]).top + 0.75 * height)
      tooltip.html(years[i] + ' ' + quarters[i] + '<br>' + '$' + GDP[i].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + ' Billion')
        .attr("data-date", d[0])
        .attr("data-gdp", d[1])
        .style('opacity', 0.9)
        .attr('class', 'tooltip')



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

}

