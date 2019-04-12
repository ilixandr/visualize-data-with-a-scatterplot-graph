/* Constant definitions */
const JSON_URL = "https://raw.githubusercontent.com/ilixandr/iwannaweb.ro/master/projects/rawdata/cyclist-data.json"
const WIDTH = 800
const HEIGHT = 600
const PADDING = 100
const ANIMATION_DURATION = 250
const OPACITY_VISIBLE = 0.85
const OPACITY_INVISIBLE = 0
const DOT_RADIUS = 6

/* Helper functions */
const getPerformanceTimes = (dataset) => {
  let perfTimes = [];
  for (let i = 0; i < dataset.length; i++){
    perfTimes.push(new Date(2019, 0, 1, 0, dataset[i].Time.split(":")[0], dataset[i].Time.split(":")[1]));
  }
  return perfTimes;
}
const colorScheme = d3.scaleOrdinal(d3.schemeBlues[9]);
/* Define svg */
const canvas = d3.select("#graph")
                 .append("svg")
                 .attr("width", WIDTH + PADDING)
                 .attr("height", HEIGHT + PADDING);
const tooltip = d3.select("#tooltip");
/* Read JSON data */
d3.json(JSON_URL).then((dataset) => {
  const xScale = d3.scaleLinear()
                   .domain([d3.min(dataset, (d) => d.Year - 1), d3.max(dataset, (d) => d.Year + 1)])
                   .range([0, WIDTH]);
  const perfTimes = getPerformanceTimes(dataset);
  const yScale = d3.scaleTime()
                   .domain([d3.min(perfTimes, (d)=> d), d3.max(perfTimes, (d) => d)])
                   .range([0, HEIGHT]);
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
  const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));
  
  canvas.append("g")
        .attr("transform", "translate(" + (PADDING / 2) + ", " + HEIGHT + ")").call(xAxis).attr("id", "x-axis");
  canvas.append("g")
        .attr("transform", "translate(" + PADDING / 2 + ", 0)").call(yAxis).attr("id", "y-axis");
  canvas.selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("cx", (d) => PADDING / 2 + xScale(d.Year))
        .attr("cy", (d, i) => yScale(perfTimes[i]))
        .attr("r", DOT_RADIUS)
        .attr("class", "dot")
        .attr("data-xvalue", (d) => d.Year)
        .attr("data-yvalue", (d, i) => perfTimes[i])
        .attr("fill", (d) => {return d.Doping === "" ? "green" : "red"})
        .on("mouseover", (d, i) => {
    tooltip.transition()
           .duration(ANIMATION_DURATION)
           .style("opacity", OPACITY_VISIBLE)
    tooltip.html(d.Name + ", " + d.Year + "<br />Time: " + d.Time + "<br />" + d.Doping)
           .style("left", xScale(d.Year) + WIDTH / 2 + 60 + "px")
           .style("top", yScale(perfTimes[i]) + PADDING + "px")
           .attr("data-year", d.Year);
           
  })
        .on("mouseout", () => {
    tooltip.transition()
           .duration(ANIMATION_DURATION)
           .style("opacity", OPACITY_INVISIBLE)
  });
  
});