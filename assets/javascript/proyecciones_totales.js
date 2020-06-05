// set the dimensions and margins of the graph
var margin = {top: 10, right: 10, bottom: 0, left: 30},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
    //width=$("#proyecciones_totales").width(),
    //height=width/1.5;

var url="https://raw.githubusercontent.com/LeonardoCastro/COVID19-Mexico/master/data/proyecciones_04abril.csv";

//var tip = d3.select("#proyecciones_totales").append("div")
//    .attr("class", "tip")
//    .style("opacity", 0);

var svgProy = d3.select("#proyecciones_totales")
  .append("svg")
  .attr("width", width+margin.left+margin.right+0)
  .attr("height",height+margin.top+margin.bottom+70)
  .append("g")
    .attr("transform",
          "translate(" +(0+ margin.left )+ "," + (margin.top) + ")");


//Read the data
d3.csv(url, function(data) {

    var tope=data.length-1;

    data.forEach(function(d) {
               d.Fecha = new Date(d.Fecha);
               d.México = +d.México;
            });

    // define the x scale (horizontal)
    formatMonth = d3.timeFormat("%b"),
    formatDay = d3.timeFormat("%d");

    var mindate = new Date(2020,1,28);
    var today = new Date();

    // Add X axis --> it is a date format
    var x = d3.scaleTime()
      .domain([mindate,data[tope]['Fecha']])
      .range([ 0, width-10 ]);


    svgProy.append("g")
      .attr("transform", "translate(0," + (height-10) + ")")
      .attr("class","graph_date")
      .call(d3.axisBottom(x))
      .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");



    // Add Y axis
    var y = d3.scaleLinear()
              .domain( [0,d3.max(data, function(d){return +d.Susana_00;  })*1.1])
              .range([ height-10, 0 ]);
        svgProy.append("g")
            .call(d3.axisLeft(y)) ;

    // Initialize line with group a
    var line = svgProy.append('g')
                  .append("path")
                  .datum(data)
                  .attr("d", d3.line()
                        .x(function(d) { return x(d.Fecha) })
                        .y(function(d) { return y(+d.México) })
                        )
                  .attr("stroke", "#1f9bcf")
                  .style("stroke-width", 3)
                  .style("fill", "none")
/*
    // Initialize dots with group a
    var dot = svgProy.selectAll('circle')
                  .data(data)
                  .enter()
                  .append('circle')
                  .attr("cx", function(d) { return x(d.Fecha) })
                  .attr("cy", function(d) { return y(+d.México) })
                  .attr("r", 5)
                  .style("fill", "#1F9BCF")
                  .on("mouseover", function(d) {
                        tip.transition()
                            .duration(200)
                            .style("opacity", .9);
                        tip.html("<h6>" + formatDay(d.Fecha) + "/" + formatMonth(d.Fecha) + "</h6>"+ " <p class='text-primary'>"  + d.México + "</p>")
                            .style("left", (d3.event.pageX) + "px")
                            .style("top", (d3.event.pageY - 30) + "px");
                        })
                  .on("mouseout", function(d) {
                        tip.transition()
                            .duration(500)
                            .style("opacity", 0);
                      });
/*
      // Initialize line Susanna_00
      var line = svgProy.append('g')
                    .append("path")
                    .datum(data)
                    .attr("d", d3.line()
                          .x(function(d) { return x(d.Fecha) })
                          .y(function(d) { return y(+d.Susana_00) })
                          )
                    .attr("stroke", "#ffffff")
                    .style("stroke-width", 3)
                    .style("fill", "none")

      // Initialize dots with group a
      var dot = svgProy.selectAll('circle')
                    .data(data)
                    .enter()
                    .append('circle')
                    .attr("cx", function(d) { return x(d.Fecha) })
                    .attr("cy", function(d) { return y(+d.Susana_00) })
                    .attr("r", 5)
                    .style("fill", "#1F9BCF")
                    .on("mouseover", function(d) {
                          tip.transition()
                              .duration(200)
                              .style("opacity", .9);
                          tip.html("<h6>" + formatDay(d.Fecha) + "/" + formatMonth(d.Fecha) + "</h6>"+ " <p class='text-primary'>"  + d.Susana_00 + "</p>")
                              .style("left", (d3.event.pageX) + "px")
                              .style("top", (d3.event.pageY - 30) + "px");
                          })
                    .on("mouseout", function(d) {
                          tip.transition()
                              .duration(500)
                              .style("opacity", 0);
                        });


        // Initialize line Susana_20
        var line = svgProy.append('g')
                      .append("path")
                      .datum(data)
                      .attr("d", d3.line()
                            .x(function(d) { return x(d.Fecha) })
                            .y(function(d) { return y(+d.Susana_20) })
                            )
                      .attr("stroke", "#1f9bcf")
                      .style("stroke-width", 3)
                      .style("fill", "none")

        // Initialize dots with group a
        var dot = svgProy.selectAll('circle')
                      .data(data)
                      .enter()
                      .append('circle')
                      .attr("cx", function(d) { return x(d.Fecha) })
                      .attr("cy", function(d) { return y(+d.Susana_20) })
                      .attr("r", 5)
                      .style("fill", "#1F9BCF")
                      .on("mouseover", function(d) {
                            tip.transition()
                                .duration(200)
                                .style("opacity", .9);
                            tip.html("<h6>" + formatDay(d.Fecha) + "/" + formatMonth(d.Fecha) + "</h6>"+ " <p class='text-primary'>"  + d.Susana_20 + "</p>")
                                .style("left", (d3.event.pageX) + "px")
                                .style("top", (d3.event.pageY - 30) + "px");
                            })
                      .on("mouseout", function(d) {
                            tip.transition()
                                .duration(500)
                                .style("opacity", 0);
                          });

          // Initialize line with group a
          var line = svgProy.append('g')
                        .append("path")
                        .datum(data)
                        .attr("d", d3.line()
                              .x(function(d) { return x(d.Fecha) })
                              .y(function(d) { return y(+d.Susana_50) })
                              )
                        .attr("stroke", "#1f9bcf")
                        .style("stroke-width", 3)
                        .style("fill", "none");

          // Initialize dots with group a
          var dot = svgProy.selectAll('circle')
                        .data(data)
                        .enter()
                        .append('circle')
                        .attr("cx", function(d) { return x(d.Fecha) })
                        .attr("cy", function(d) { return y(+d.Susana_50) })
                        .attr("r", 5)
                        .style("fill", "#1F9BCF")
                        .on("mouseover", function(d) {
                              tip.transition()
                                  .duration(200)
                                  .style("opacity", .9);
                              tip.html("<h6>" + formatDay(d.Fecha) + "/" + formatMonth(d.Fecha) + "</h6>"+ " <p class='text-primary'>"  + d.Susana_50 + "</p>")
                                  .style("left", (d3.event.pageX) + "px")
                                  .style("top", (d3.event.pageY - 30) + "px");
                              })
                        .on("mouseout", function(d) {
                              tip.transition()
                                  .duration(500)
                                  .style("opacity", 0);
                            });


  // Line for fase 2

  // date for fase 2
  var fase12=new Date(2020,2,23);

  var fase= svgProy.append("line")
                .attr("x1", x(fase12))
                .attr("y1", y(y.domain()[0]))
                .attr("x2", x(fase12))
                .attr("y2", y(y.domain()[1]))
                .attr("stroke", "#000000") //fd7e14
                .style("stroke-width", 1)
                .style("fill", "none")
                .style("stroke-dasharray", "5,5") ;

  // text fase 12
  svgProy.append("text")
      .attr("y",y(y.domain()[1]))
      .attr("x",x(fase12)-5)
      .attr("dy", "1em")
      .style("text-anchor", "end")
      .text("Comienza la fase 2")
      .attr("stroke", "#000000")
      .attr("font-family","sans-serif");
*/

  // Animation
  // Add 'curtain' rectangle to hide entire graph
/*  var curtain = svgProy.append('rect')
                    .attr('x', -1 * width)
                    .attr('y', -1 * height)
                    .attr('height', height)
                    .attr('width', width)
                    .attr('class', 'curtain')
                    .attr('transform', 'rotate(180)')
                    .style('fill', '#ffffff');

  // Optionally add a guideline
  var guideline = svgProy.append('line')
                      .attr('stroke', '#333')
                      .attr('stroke-width', 0)
                      .attr('class', 'guide')
                      .attr('x1', 1)
                      .attr('y1', 1)
                      .attr('x2', 1)
                      .attr('y2', height);

  //Create a shared transition for anything we're animating
  var t = svgProy.transition()
              .delay(1000)
              .duration(3700)
              .ease(d3.easeLinear)
              .on('end', function() {
                d3.select('line.guide')
                  .transition()
                  .style('opacity', 0)
                  .remove()
                });

  t.select('rect.curtain')
    .attr('width', 0);
  t.select('line.guide')
    .attr('transform', 'translate(' + width + ', 0)');

  d3.select("#show_guideline").on("change", function(e) {
    guideline.attr('stroke-width', this.checked ? 1 : 0);
    curtain.attr("opacity", this.checked ? 0.75 : 1);
    })
    */
});
