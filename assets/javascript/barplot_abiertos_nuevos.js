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
            left: 45
        },
   w = (w- (margin.left + margin.right) );
    h = (h - (margin.top + margin.bottom));
var urlNuevos = "https://raw.githubusercontent.com/mexicovid19/Mexico-datos/master/datos_abiertos/formato_especial/pruebas_casos_nuevos.csv";

var widthBar = 6;

var tipH = d3.select("#barplot_abiertos_nuevos").append("div")
    .attr("class", "tipH")
    .style("opacity", 0);
// append the svg object to the body of the page
var svgBar = d3.select("#barplot_abiertos_nuevos")
  .append("svg")
  .attr("width", w_full)
  .attr("height",h_full)
  .append("g")
  .attr("transform",
        "translate(" + (margin.left )+ "," + margin.top + ")");

// Parse the Data
d3.csv(urlNuevos, function(data) {

        // List of subgroups = header of the csv files = soil condition here
  var subgroups = data.columns.slice(1)
  console.log(subgroups);

  // List of groups = species here = value of the first column called group -> I show them on the X axis
  var groups = d3.map(data, function(d){return(d.group)}).keys()

  data.forEach(function(d) {
             d.Fecha = new Date(d.Fecha);
             d.positivos = +d.positivos;
             d.negativos = +d.negativos;
             d.pendientes = +d.pendientes;
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
            .domain([0, 1.1*d3.max(data, function(d){return d.negativos+d.positivos+d.pendientes;  })])
            .range([ h, 0]);

  svgBar.append("g")
        .call(d3.axisLeft(y));

  // color palette = one color per subgroup
   var color = d3.scaleOrdinal()
     .domain(subgroups)
     .range(['darkolivegreen','steelblue','darkorange'])


  var stackedData = d3.stack()
                      .keys(subgroups)
                      (data)
  console.log(stackedData);
          // Show the bars
          svgBar.append("g")
                .selectAll("g")
                // Enter in the stack data = loop key per key = group per group
                .data(stackedData)
                .enter().append("g")
                .attr("fill", function(d) { return color(d.key); })
                .selectAll("rect")
                // enter a second time = loop subgroup per subgroup to add all rectangles
                .data(function(d) { return d; })
                .enter().append("rect")
                .attr("x", function(d) { return x(d.data.Fecha); })
                .attr("y", function(d) { return y(d[1]); })
                .attr("height", function(d) { return y(d[0]) - y(d[1]); })
                .attr("width",widthBar)
                .on("mouseover", function(d) {
                      tipH.transition()
                          .duration(200)
                          .style("opacity", .9);
                      tipH.html("<h6>" + formatDay(d.data.Fecha) + "/" + formatMonth(d.data.Fecha) + "</h6>"+
                      //" <p class='text-primary'>"  + d.key + "</p>" +
                      " <p class='text-primary'>"  + (+(d[1]-d[0])).toLocaleString() + "</p>")
                          .style("left", (d3.event.pageX) + "px")
                          .style("top", (d3.event.pageY - 28) + "px");
                        })
                .on("mouseout", function(d) {
                    tipH.transition()
                        .duration(500)
                        .style("opacity", 0);
                  });


  var dot = svgBar.selectAll('dot')
      .data(data)
      .enter()
      .append('circle')
      .attr("cx", function(d) {
          return x(d.Fecha)+widthBar/2
      })
      .attr("cy", function(d) {
          return y(d.positivos+d.pendientes+d.negativos+33)
      })
      .attr("r", 3)
      .attr("opacity",0.95)
      .attr("visibility", function(d, i) {
          if (d.Fecha < mindate) return "hidden";
      })
      .style("fill", "darkmagenta")
      .on("mouseover", function(d) {
          tip.transition()
              .duration(200)
              .style("opacity", .9);
          tip.html("<h6>" + formatDay(d.Fecha) + "/" + formatMonth(d.Fecha) + "</h6>" +
                    " <p class='text-primary'>Pruebas totales" + "</p>" +
                    " <p class='text-primary'>" + (+(d.positivos+d.pendientes+d.negativos)).toLocaleString() + "</p>")
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY - 30) + "px");
      })
      .on("mouseout", function(d) {
          tip.transition()
              .duration(500)
              .style("opacity", 0);
      });

 
      //Lineas fases

      //Fase 3
      var fase3=new Date(2020,3,20);

      var fase = svgBar.append("line")
          .attr("x1", x(fase3))
          .attr("y1", y(y.domain()[0]))
          .attr("x2", x(fase3))
          .attr("y2", y(y.domain()[1]))
          .attr("stroke", "#000000")
          .style("stroke-width", 1)
          .style("fill", "none")
          .style("stroke-dasharray", "5,5");

      svgBar.append("text")
          .attr("y", x(fase3)-15)
          .attr("x", y(y.domain()[1])-70)
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .style("font-size","10px")
          .text("Comienza la fase 3")
          .attr("stroke", "#000000")
          .attr("font-family", "sans-serif")
          .attr("transform", "rotate(-90)");

      //Fase 2
      var fase12 = new Date(2020, 2, 23);

      var fase = svgBar.append("line")
          .attr("x1", x(fase12))
          .attr("y1", y(y.domain()[0]))
          .attr("x2", x(fase12))
          .attr("y2", y(y.domain()[1]))
          .attr("stroke", "#000000")
          .style("stroke-width", 1)
          .style("fill", "none")
          .style("stroke-dasharray", "5,5");

      svgBar.append("text")
          .attr("y", x(fase12)-15)
          .attr("x", y(y.domain()[1])-70)
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .style("font-size","10px")
          .text("Comienza la fase 2")
          .attr("stroke", "#000000")
          .attr("font-family", "sans-serif")
          .attr("transform", "rotate(-90)");
      //Emergencia sanitaria
      var faseExt=new Date(2020, 2, 30);;

      var fase = svgBar.append("line")
          .attr("x1", x(faseExt))
          .attr("y1", y(y.domain()[0]))
          .attr("x2", x(faseExt))
          .attr("y2", y(y.domain()[1]))
          .attr("stroke", "#000000")
          .style("stroke-width", 1)
          .style("fill", "none")
          .style("stroke-dasharray", "5,5");

      svgBar.append("text")
          .attr("y", x(faseExt)-15)
          .attr("x", y(y.domain()[1])-70)
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .style("font-size","10px")
          .text("Emergencia sanitaria")
          .attr("stroke", "#000000")
          .attr("font-family", "sans-serif")
          .attr("transform", "rotate(-90)");

      var faseFin=new Date(2020, 5, 1);;

      var fase = svgBar.append("line")
          .attr("x1", x(faseFin))
          .attr("y1", y(y.domain()[0]))
          .attr("x2", x(faseFin))
          .attr("y2", y(y.domain()[1]))
          .attr("stroke", "#000000")
          .style("stroke-width", 1)
          .style("fill", "none")
          .style("stroke-dasharray", "5,5");

      svgBar.append("text")
          .attr("y", y(y.domain()[1]))
          .attr("x", x(faseFin)-80)
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .style("font-size","10px")
          .text("Fin de la jornada nacional")
          .attr("stroke", "#000000")
          .attr("font-family", "sans-serif");


    //Leyenda
   var coordX =(x(x.domain()[1])-(margin.left+margin.right))*0.15,
       coordY =  (y(y.domain()[1])+margin.top+25);
       offset=30;


     //Leyenda Negativas
     svgBar.append('circle')
             .attr("cx", coordX-20)
             .attr("cy", coordY+110)
             .attr("r", 5)
             .attr("opacity",0.95)
             .style("fill", "darkmagenta")
     svgBar.append("text").attr("x", coordX-12).attr("y", coordY+110).text("Pruebas totales").style("font-size", "10px").attr("alignment-baseline","middle")

    //Leyenda Negativas
    svgBar.append('circle')
            .attr("cx", coordX-20)
            .attr("cy", coordY+130)
            .attr("r", 5)
            .attr("opacity",0.95)
            .style("fill", "darkorange")
    svgBar.append("text").attr("x", coordX-12).attr("y", coordY+130).text("Pruebas negativas").style("font-size", "10px").attr("alignment-baseline","middle")

    //Leyenda Positivas
    svgBar.append('circle')
            .attr("cx", coordX-20)
            .attr("cy", coordY+150)
            .attr("r", 5)
            .attr("opacity",0.95)
            .style("fill", "steelblue")
    svgBar.append("text").attr("x", coordX-12).attr("y", coordY+150).text("Pruebas pendientes").style("font-size", "10px").attr("alignment-baseline","middle")

    //Leyenda Pendientes
    svgBar.append('circle')
            .attr("cx", coordX-20)
            .attr("cy", coordY+170)
            .attr("r", 5)
            .attr("opacity",0.95)
            .style("fill", "darkolivegreen")
    svgBar.append("text").attr("x", coordX-12).attr("y", coordY+170).text("Pruebas positivas").style("font-size", "10px").attr("alignment-baseline","middle")

});
