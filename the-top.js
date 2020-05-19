const svg = d3.select("svg");

data = data.map((d, i) => {
  d.difference = d.imdb - d.metascore;
  return d;
});

svg.attr("height", 40 * data.length).attr("width", 960);

const scoreScale = d3
  .scaleLinear()
  .domain([0, 100])
  .range([420, 900]);

const area = d3
  .area()
  .x0((d, i) => scoreScale(d.imdb))
  .x1((d, i) => scoreScale(d.metascore))
  .y0((d, i) => 40 * i + 20)
  .y1((d, i) => 40 * i + 20)
  .curve(d3.curveCardinal.tension(0.1));

const areaPath = svg
  .append("path")
  .datum(data)
  .attr("d", area)
  .attr("class", "area");

const imdbLine = d3
  .line()
  .x((d, i) => scoreScale(d.imdb))
  .y((d, i) => 40 * i + 20)
  .curve(d3.curveCardinal.tension(0.1));

const imdbPath = svg
  .append("path")
  .datum(data)
  .attr("d", imdbLine)
  .attr("class", "imdbPath");

const metascoreLine = d3
  .line()
  .x((d, i) => scoreScale(d.metascore))
  .y((d, i) => 40 * i + 20)
  .curve(d3.curveCardinal.tension(0.1));

const metascorePath = svg
  .append("path")
  .datum(data)
  .attr("d", metascoreLine)
  .attr("class", "metascorePath");

const groups = svg
  .selectAll("g.movie")
  .data(data)
  .enter()
  .append("g")
  .attr("class", "movie")
  .attr("transform", (d, i) => `translate(0, ${i * 40})`);

groups
  .append("rect")
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", 960)
  .attr("height", 40)
  .attr("class", "background");

groups
  .append("text")
  .attr("x", 90)
  .attr("y", 20)
  .attr("class", "title")
  .text((d, i) => d.title);

groups
  .append("text")
  .attr("x", 24)
  .attr("y", 20)
  .attr("class", "year")
  .text((d, i) => d.year);

groups
  .append("circle")
  .attr("cx", (d, i) => scoreScale(d.imdb))
  .attr("cy", 20)
  .attr("r", 8)
  .attr("class", "imdb");

groups
  .append("circle")
  .attr("cx", (d, i) => scoreScale(d.metascore))
  .attr("cy", 20)
  .attr("r", 8)
  .attr("class", "metascore");

groups
  .append("text")
  .attr("x", (d, i) => {
    return d.difference > 0 ? scoreScale(d.imdb) + 15 : scoreScale(d.imdb) - 15;
  })
  .attr("y", 20)
  .text((d, i) => d.imdb)
  .attr("class", "imdbScore")
  .style("text-anchor", (d, i) => {
    return d.difference > 0 ? "start" : "end";
  });

groups
  .append("text")
  .attr("x", (d, i) => {
    return d.difference > 0
      ? scoreScale(d.metascore) - 15
      : scoreScale(d.metascore) + 15;
  })
  .attr("y", 20)
  .text((d, i) => d.metascore)
  .attr("class", "metascoreScore")
  .style("text-anchor", (d, i) => {
    return d.difference > 0 ? "end" : "start";
  });

const selectTag = document.querySelector("select");

selectTag.addEventListener("change", function() {
  data.sort((a, b) => {
    if (this.value == "imdb") {
      return d3.descending(a.imdb, b.imdb);
    } else if (this.value == "metascore") {
      return d3.descending(a.metascore, b.metascore);
    } else if (this.value == "year") {
      return d3.descending(a.year, b.year);
    } else if (this.value == "title") {
      return d3.ascending(a.title, b.title);
    } else if (this.value == "difference") {
      return d3.descending(a.difference, b.difference);
    }
  });
  groups
    .data(data, (d, i) => d.title)
    .transition()
    .duration(1000)
    .ease(d3.easeExpOut)
    .attr("transform", (d, i) => `translate(0, ${i * 40})`);

  imdbPath
    .datum(data, (d, i) => d.title)
    .transition()
    .duration(1000)
    .ease(d3.easeExpOut)
    .attr("d", imdbLine);

  metascorePath
    .datum(data, (d, i) => d.title)
    .transition()
    .duration(1000)
    .ease(d3.easeExpOut)
    .attr("d", metascoreLine);

  areaPath
    .datum(data, (d, i) => d.title)
    .transition()
    .duration(1000)
    .ease(d3.easeExpOut)
    .attr("d", area);
});
