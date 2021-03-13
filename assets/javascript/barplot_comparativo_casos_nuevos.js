var w = 610,
    h = 400,
    w_full = w,
    h_full = h;

if (w > $( window ).width()) {
  w = $( window ).width();
}

// set the dimensions and margins of the graph
var margin = {top: 10, right: 10, bottom: 50, left: 50},
    w = w - margin.left - margin.right,
    h = h - margin.top - margin.bottom;

var urlNuevos = "https://raw.githubusercontent.com/mexicovid19/Mexico-datos/master/datos_abiertos/formato_especial/comparativo_casos_nuevos.csv";

var widthBar = 6;

var tipH = d3.select("#barplot_nuevos").append("div")
      .attr("class", "tipH")
      .style("opacity", 0);

var tipP = d3.select("#barplot_nuevos").append("div")
      .attr("class", "tipP")
      .style("opacity", 0);

// append the svg object to the body of the page
var svgBarC = d3.select("#barplot_nuevos")
  .append("svg")
    .attr("width", w_full)
    .attr("height", h_full)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// X axis
var today = new Date();
//var two_weeks_ago = new Date()
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

var mindate = new Date(2020,2,8);

var diff_two_weeks = Math.abs(new Date(2020, 0, 16) - new Date(2020, 0, 1));
var two_weeks_ago = new Date(today.getTime()-diff_two_weeks);


var x = d3.scaleTime()
          .domain([mindate, today])
          .range([0, w]);

var xAxis = svgBarC.append("g")
  .attr("transform", "translate(0," + h + ")")
  .attr("class","graph_date")
  .call(d3.axisBottom(x))
  .selectAll("text")
  .style("text-anchor", "end")
  .attr("dx", "-.8em")
  .attr("dy", ".15em")
  .attr("transform", "rotate(-65)");

// Initialize the Y axis
var y = d3.scaleLinear()
  .range([ h, 0]);
var yAxis = svgBarC.append("g")
  .attr("class", "myYaxis")


// A function that create / update the plot for a given variable:
function update(selectedVar) {

  // Parse the Data
  d3.csv(urlNuevos, function(data) {

    data.forEach(function(d) {
             d.Fecha = new Date(d.Fecha);
          });

    // Add Y axis
    y.domain([0, 1.25*d3.max(data, function(d) { return +d[selectedVar] }) ]);
    yAxis.transition().duration(1000).call(d3.axisLeft(y));

    // variable u: map data to existing bars
    var u = svgBarC.selectAll("rect")
      .data(data)

    // update bars
    u
      .enter()
      .append("rect")
      .merge(u)
      //.transition()
      //.duration(1000)
      //.delay(function(d,i){ return(i*100)})
        .attr("x", function(d) { return x(d.Fecha)-widthBar/2; })
        .attr("y", function(d) { return y(d[selectedVar]); })
        .attr("width", widthBar)
        .attr("height", function(d) { return h - y(d[selectedVar]); })
        .attr("fill", function(d){ if (selectedVar == "Nuevos_JH") { return "#1f9bcf"} else {return "darkorange"}})
        .on("mouseover", function(d) {
          tipH.transition()
              .duration(200)
              .style("opacity", .9);
          tipH.html("<h6>" + formatDay(d.Fecha) + "/" + formatMonth(d.Fecha) + "</h6>"+ " <p class='text-primary'>"  + d[selectedVar] + "</p>")
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY - 28) + "px");
            })
        .on("mouseout", function(d) {
          tipH.transition()
              .duration(500)
              .style("opacity", 0);
            })
        .attr("opacity", function(d){if (d.Fecha > two_weeks_ago && selectedVar != "Nuevos_JH"){ return 0.5 } else { return .7 }});

        var dot = svgBarC
                  .selectAll("circle")
                  .data(data)

              dot.enter()
                  .append("circle")
                  .attr("cx", function(d) { if (d.Fecha > mindate ) {return x(d.Fecha)}})
                  .attr("cy", function(d) { return y(+d.Nuevos_JH_promedio)})
                  .attr("r", 4)
                  .attr("opacity", .8)
                  .style("fill", "mediumorchid")
                  .on("mouseover", function(d) {
                      tipP.transition()
                          .duration(200)
                          .style("opacity", .9);
                      tipP.html("<h6>" + formatDay(d.Fecha) + "/" + formatMonth(d.Fecha) + "</h6>" +
                                " <p class='text-primary'>Promedio 7 dias" + "</p>" +
                                " <p class='text-primary'>" + (+d["Nuevos_JH_promedio"]).toLocaleString() + "</p>")
                          .style("left", (d3.event.pageX) + "px")
                          .style("top", (d3.event.pageY - 30) + "px");
                  })
                  .on("mouseout", function(d) {
                      tipP.transition()
                          .duration(500)
                          .style("opacity", 0);
                  })

              function update(selectedOption) {

                dot
                  .data(data)
                  //.transition()
                  .style("fill", function(d){if (selectedOption=="Nuevos_JH") {return "mediumorchid";} else {return "tomato";}})
                  //.duration(1000)
                    //.attr("cx", function(d) { if (d.Fecha > mindate ) {return x(d.Fecha)}})
                    .attr("cy", function(d) { return y(+d[selectedOption+"_promedio"]) })
                    .attr("opacity", function(d){if (d.Fecha > two_weeks_ago && selectedOption != "Nuevos_JH"){ return 0.5 } else { return 1. }})
                    .on("mouseover", function(d) {
                        tipP.transition()
                            .duration(200)
                            .style("opacity", .9);
                        tipP.html("<h6>" + formatDay(d.Fecha) + "/" + formatMonth(d.Fecha) + "</h6>" +
                                  " <p class='text-primary'>Promedio 7 dias" + "</p>" +
                                  " <p class='text-primary'>" + (+d[selectedOption+'_promedio']).toLocaleString() + "</p>")
                            .style("left", (d3.event.pageX) + "px")
                            .style("top", (d3.event.pageY - 30) + "px");
                    })
                    .on("mouseout", function(d) {
                        tipP.transition()
                            .duration(500)
                            .style("opacity", 0);
                    });
              }

              update(selectedVar)

  })
};

// Initialize plot
update('Nuevos_JH')


//Lineas fases
var faseFin=new Date(2020, 5, 1);

var fase = svgBarC.append("line")
    .attr("x1", x(faseFin))
    .attr("y1", y(y.domain()[0]))
    .attr("x2", x(faseFin))
    .attr("y2", y(y.domain()[1]))
    .attr("stroke", "#000000")
    .style("stroke-width", 1)
    .style("fill", "none")
    .style("stroke-dasharray", "5,5");

svgBarC.append("text")
    .attr("y", y(y.domain()[1]))
    .attr("x", x(faseFin)+80)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font-size","10px")
    .text("Fin de la jornada nacional")
    .attr("stroke", "#000000")
    .attr("font-family", "sans-serif");

var faseVacunas=new Date(2020, 11, 24);

var fase = svgBarC.append("line")
    .attr("x1", x(faseVacunas))
    .attr("y1", y(y.domain()[0]))
    .attr("x2", x(faseVacunas))
    .attr("y2", y(y.domain()[1]))
    .attr("stroke", "#000000")
    .style("stroke-width", 1)
    .style("fill", "none")
    .style("stroke-dasharray", "5,5");

  svgBarC.append("text")
      .attr("y", y(y.domain()[1])+20)
      .attr("x", x(faseVacunas)-70)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size","10px")
      .text("Empieza vacunación")
      .attr("stroke", "#000000")
      .attr("font-family", "sans-serif");
