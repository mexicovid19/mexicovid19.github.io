// set the dimensions and margins of the graph
    var w = 600,
        h = 400,
        w_full = w,
        h_full = h;

    if (w > $( window ).width()) {
      w = $( window ).width();
    }

    var margin = {
            top: 10,
            right: 10,
            bottom: 50,
            left: 40
        },
   w = (w- (margin.left + margin.right) );
    h = (h - (margin.top + margin.bottom));
var urlNuevos = "https://raw.githubusercontent.com/mexicovid19/Mexico-datos/master/datos/series_de_tiempo/covid19_mex_casos_nuevos.csv";

var widthBar = 6;

var tipH = d3.select("#barplot_nuevos").append("div")
    .attr("class", "tipH")
    .style("opacity", 0);
// append the svg object to the body of the page
var svgBar = d3.select("#barplot_nuevos")
  .append("svg")
  .attr("width", w_full)
  .attr("height",h_full)
  .append("g")
  .attr("transform",
        "translate(" + (margin.left )+ "," + margin.top + ")");

// Parse the Data
d3.csv(urlNuevos, function(data) {

  data.forEach(function(d) {
             d.Fecha = new Date(d.Fecha);
             d.Nacional = +d.Nacional;
          });

  // X axis
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  //today = mm + '/' + dd + '/' + yyyy;


  var mindate = new Date(2020,1,28);

  // Add X axis --> it is a date format
  var x = d3.scaleTime()
            .domain([mindate,today])
            .range([ 0, w ]);

  svgBar.append("g")
        .attr("transform", "translate(0," + h + ")")
        .attr("class","graph_date")
        .call(d3.axisBottom(x))
        .selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("transform", "rotate(-65)");

  // Add Y axis
  var y = d3.scaleLinear()
            .domain([0, 1.1*d3.max(data, function(d){return d.Nacional;  })])
            .range([ h, 0]);

  svgBar.append("g")
        .call(d3.axisLeft(y));

  // Bars
  var bar = svgBar.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
          .attr("x", function(d) { return x(+d.Fecha) - widthBar/2; })
          //.attr("y", function(d) { return y(+d.México); })
          .attr("width", widthBar)
          //.attr("height", function(d) { return height - y(+d.México); })
          .attr("fill", '#1f9bcf')
          // no bar at the beginning thus:
          .attr("height", function(d) { return h - y(0); }) // always equal to 0
          .attr("y", function(d) { return y(0); })
          .on("mouseover", function(d) {
            tipH.transition()
                .duration(200)
                .style("opacity", .9);
            tipH.html("<h6>" + formatDay(d.Fecha) + "/" + formatMonth(d.Fecha) + "</h6>"+ " <p class='text-primary'>"  + d.Nacional + "</p>")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            })
        .on("mouseout", function(d) {
            tipH.transition()
                .duration(500)
                .style("opacity", 0);
        });

        var fase3=new Date(2020,3,20);
        //Añade línea de fase 2
        var fase = svgBar.append("line")
            .attr("x1", x(fase3))
            .attr("y1", y(y.domain()[0]))
            .attr("x2", x(fase3))
            .attr("y2", y(y.domain()[1])+17)
            .attr("stroke", "#000000") //fd7e14
            .style("stroke-width", 1)
            .style("fill", "none")
            .style("stroke-dasharray", "5,5");

        // texto fase 12
        svgBar.append("text")
            //.attr("transform", "rotate(-90)")
            .attr("y", y(y.domain()[1])) //-0 - margin.left
            .attr("x", x(fase3) - 30)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .style("font-size","10px")
            .text("Comienza la fase 3")
            .attr("stroke", "#000000")
            .attr("font-family", "sans-serif");

var fase12=new Date(2020,2,23);
//Añade línea de fase 2
var fase = svgBar.append("line")
    .attr("x1", x(fase12))
    .attr("y1", y(y.domain()[0]))
    .attr("x2", x(fase12))
    .attr("y2", y(y.domain()[1])+57)
    .attr("stroke", "#000000") //fd7e14
    .style("stroke-width", 1)
    .style("fill", "none")
    .style("stroke-dasharray", "5,5");

// texto fase 12
svgBar.append("text")
    //.attr("transform", "rotate(-90)")
    .attr("y", y(y.domain()[1])+40) //-0 - margin.left
    .attr("x", x(fase12) - 5)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font-size","10px")
    .text("Comienza la fase 2")
    .attr("stroke", "#000000")
    .attr("font-family", "sans-serif");

var faseExt=new Date(2020, 2, 30);;

//Añade línea de emergencia
var fase = svgBar.append("line")
    .attr("x1", x(faseExt))
    .attr("y1", y(y.domain()[0]))
    .attr("x2", x(faseExt))
    .attr("y2", y(y.domain()[1])+37)
    .attr("stroke", "#000000") //fd7e14
    .style("stroke-width", 1)
    .style("fill", "none")
    .style("stroke-dasharray", "5,5");

// texto emergencia
svgBar.append("text")
    //.attr("transform", "rotate(-90)")
    .attr("y", y(y.domain()[1])+20) //-0 - margin.left
    .attr("x", x(faseExt) - 5)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font-size","10px")
    .text("Emergencia sanitaria")
    .attr("stroke", "#000000")
    .attr("font-family", "sans-serif");


  // Animation
  svgBar.selectAll("rect")
  .transition()
  .duration(400)
  .attr("y", function(d) { return y(+d.Nacional); })
  .attr("height", function(d) { return h - y(+d.Nacional); })
  .delay(function(d,i){ return(i*100)})


})
