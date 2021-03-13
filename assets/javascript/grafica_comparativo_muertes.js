// set the dimensions and margins of the graph
    var w = 610,
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
            left: 60
        },

   w = (w- (margin.left + margin.right) );
    h = (h - (margin.top + margin.bottom));

var url = "https://raw.githubusercontent.com/mexicovid19/Mexico-datos/master/datos_abiertos/formato_especial/comparativo_muertes_acumuladas.csv";

var tip = d3.select("#grafica_muertes").append("div")
    .attr("class", "tip")
    .style("opacity", 0);

    d3.select("#grafica_muertes").append('style')
    .text('svg {max-width:100%}')

var svgT = d3.select("#grafica_muertes")
    .append("svg")
    .attr("width", w_full)//weight + margin.left + margin.right + 0)
    .attr("height", h_full)//height + margin.top + margin.bottom + 70)
    .append("g")
    .attr("transform",
    "translate(" + ( margin.left) + "," + (margin.top) + ")");

// define the x scale (horizontal)

var today = new Date();
var mindate = new Date(2020, 2, 18);
var two_weeks_ago = new Date(today.getFullYear(),today.getMonth(),today.getDay()-14);

// Add X axis --> it is a date format
var x = d3.scaleTime()
    .domain([mindate, today])
    .range([0, w]);//width - 10]);


svgT.append("g")
    .attr("transform", "translate(0,"  +h + ")")//(height - 10)
    .attr("class", "graph_date")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-65)");


//Read the data
d3.csv(url, function(data) {
    var tope = data.length - 1;

    data.forEach(function(d) {
        d.Fecha = new Date(d.Fecha);
    });

    // Add Y axis
    var y = d3.scaleLinear()
        .range([h, 0])//height - 10
        .domain([0, 1.1*data[tope]["Nuevas_JH"]])//1.1*d3.max(data, function(d) {return d.Nuevas_abiertos;})])
    svgT.append("g")
        .call(d3.axisLeft(y));


    // Puntos de datos
    var dot = svgT.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr("cx", function(d) {
            return x(d.Fecha)
        })
        .attr("cy", function(d) {
            return y(+d.Nuevas_JH)
        })
        .attr("r", 5)
        .attr("opacity",0.7)
        .attr("visibility", function(d, i) {if (d.Fecha < mindate) return "hidden";})
        .style("fill", "mediumorchid")
        .on("mouseover", function(d) {
            tip.transition()
                .duration(200)
                .style("opacity", .9);
            tip.html("<h6>" + formatDay(d.Fecha) + "/" + formatMonth(d.Fecha) + "</h6>" + " <p class='text-primary'>" + (+d.Nuevas_JH).toLocaleString() + "</p>")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 30) + "px");
        })
        .on("mouseout", function(d) {
            tip.transition()
                .duration(500)
                .style("opacity", 0);
        });

        function update1(selectedOption) {

          dot
            .data(data)
            .transition()
            .style("fill", function(d){if (selectedOption=="Nuevas_JH") {return "mediumorchid";} else {return "darkorange";}})
            .duration(1000)
              .attr("cx", function(d) { return x(d.Fecha) })
              .attr("cy", function(d) { return y(+d[selectedOption]) })
              .on("mouseover", function(d) {
                  tip.transition()
                      .duration(200)
                      .style("opacity", .9);
                  tip.html("<h6>" + formatDay(d.Fecha) + "/" + formatMonth(d.Fecha) + "</h6>" + " <p class='text-primary'>" + (+d[selectedOption]).toLocaleString() + "</p>")
                      .style("left", (d3.event.pageX) + "px")
                      .style("top", (d3.event.pageY - 30) + "px");
              })
              .on("mouseout", function(d) {
                  tip.transition()
                      .duration(500)
                      .style("opacity", 0);
              });
          }

    d3.select("#Nuevas_JH").on("click", function(d) {
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
        update1(selectedOption)
    })

    d3.select("#Nuevas_abiertos").on("click", function(d) {
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
        update1(selectedOption)
    })


    //Lineas fases
    var faseFin=new Date(2020, 5, 1);

    var fase = svgT.append("line")
        .attr("x1", x(faseFin))
        .attr("y1", y(y.domain()[0]))
        .attr("x2", x(faseFin))
        .attr("y2", y(y.domain()[1]))
        .attr("stroke", "#000000")
        .style("stroke-width", 1)
        .style("fill", "none")
        .style("stroke-dasharray", "5,5");

    svgT.append("text")
        .attr("y", y(y.domain()[1]))
        .attr("x", x(faseFin)+80)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size","10px")
        .text("Fin de la jornada nacional")
        .attr("stroke", "#000000")
        .attr("font-family", "sans-serif");

    var faseVacunas=new Date(2020, 11, 24);

    var fase = svgT.append("line")
        .attr("x1", x(faseVacunas))
        .attr("y1", y(y.domain()[0]))
        .attr("x2", x(faseVacunas))
        .attr("y2", y(y.domain()[1]))
        .attr("stroke", "#000000")
        .style("stroke-width", 1)
        .style("fill", "none")
        .style("stroke-dasharray", "5,5");

      svgT.append("text")
          .attr("y", y(y.domain()[1])+20)
          .attr("x", x(faseVacunas)-70)
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .style("font-size","10px")
          .text("Empieza vacunación")
          .attr("stroke", "#000000")
          .attr("font-family", "sans-serif");


    });
