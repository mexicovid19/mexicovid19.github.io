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
        left: 50
    },

w = (w- (margin.left + margin.right) );
h = (h - (margin.top + margin.bottom));
var url = "https://raw.githubusercontent.com/mexicovid19/Mexico-datos/master/datos_abiertos/formato_especial/pruebas_casos_acumulados.csv";

var tip = d3.select("#grafica_abiertos_acumulados").append("div")
            .attr("class", "tip")
            .style("opacity", 0);

            d3.select("#grafica_abiertos_acumulados").append('style')
            .text('svg {max-width:100%}')

var svgT = d3.select("#grafica_abiertos_acumulados")
            .append("svg")
            .attr("width", w_full)//weight + margin.left + margin.right + 0)
            .attr("height", h_full)//height + margin.top + margin.bottom + 70)
            .append("g")
            .attr("transform",
            "translate(" + ( margin.left) + "," + (margin.top) + ")");

//Read the data
d3.csv(url, function(data) {
    console.log(data);
    var tope = data.length - 1;

    data.forEach(function(d) {
        d.Fecha = new Date(d.Fecha);
        d.positivos = +d.positivos;
        d.negativos = +d.negativos;
        d.pendientes = +d.pendientes;

    });

    // define the x scale (horizontal)
    var today = new Date();
        formatMonth = d3.timeFormat("%b"), //%m
        formatDay = d3.timeFormat("%d");


        formatMes = d3.timeFormat("%b"),
        formatDia = d3.timeFormat("%d");

    var mindate = new Date(2020, 1, 27);
    // Add X axis --> it is a date format
    var x = d3.scaleTime()
        .domain([mindate, data[tope]['Fecha']])
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

    // Add Y axis
    var y = d3.scaleLinear()
              .domain([0, d3.max(data, function(d) {
                  return +d.negativos;
              }) * 1.1])
              .range([h, 0]);//height - 10

    svgT.append("g")
        .call(d3.axisLeft(y));

    svgT.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 3.0)
        .attr("d", d3.line()
          .x(function(d) { return x(+d.Fecha) })
          .y(function(d) { return y(+d.pendientes) })
          )
        .attr("visibility", function(d, i) {
            if (d.positivos < 7) return "hidden";
        })

    svgT.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "darkorange")
        .attr("stroke-width", 3.0)
        .attr("d", d3.line()
          .x(function(d) { return x(+d.Fecha) })
          .y(function(d) { return y(+d.negativos) })
          )
        .attr("visibility", function(d, i) {
            if (d.positivos < 7) return "hidden";
        })

    svgT.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "darkolivegreen")
        .attr("stroke-width", 3.0)
        .attr("d", d3.line()
          .x(function(d) { return x(+d.Fecha) })
          .y(function(d) { return y(+d.positivos) })
          )
          .attr("visibility", function(d, i) {
              if (d.positivos < 7) return "hidden";
          })


        // Puntos de datos Negativas
        var dot = svgT.selectAll('dot')
            .data(data)
            .enter()
            .append('circle')
            .attr("cx", function(d) {
                return x(d.Fecha)
            })
            .attr("cy", function(d) {
                return y(+d.negativos)
            })
            .attr("r", 3)
            .attr("opacity",0.95)
            .attr("visibility", function(d, i) {
                if (d.Fecha < mindate) return "hidden";
            })
            .style("fill", "darkorange")
            .on("mouseover", function(d) {
                tip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tip.html("<h6>" + formatDay(d.Fecha) + "/" + formatMonth(d.Fecha) + "</h6>" +
                          " <p class='text-primary'> Pruebas negativas" + "</p>" +
                          " <p class='text-primary'>" + (+d.negativos).toLocaleString() + "</p>")
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 30) + "px");
            })
            .on("mouseout", function(d) {
                tip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

    // Puntos de datos Positivas
    var dot = svgT.selectAll('dot')
        .data(data)
        .enter()
        .append('circle')
        .attr("cx", function(d) {
            return x(d.Fecha)
        })
        .attr("cy", function(d) {
            return y(+d.positivos)
        })
        .attr("r", 3)
        .attr("opacity",0.95)
        .attr("visibility", function(d, i) {
            if (d.Fecha < mindate) return "hidden";
        })
        .style("fill", "darkolivegreen")
        .on("mouseover", function(d) {
            tip.transition()
                .duration(200)
                .style("opacity", .9);
            tip.html("<h6>" + formatDay(d.Fecha) + "/" + formatMonth(d.Fecha) + "</h6>" +
                      " <p class='text-primary'> Pruebas positivas" + "</p>" +
                      " <p class='text-primary'>" + (+d.positivos).toLocaleString() + "</p>")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 30) + "px");
        })
        .on("mouseout", function(d) {
            tip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    // Puntos de datos Pendientes
    var dot = svgT.selectAll('dot')
        .data(data)
        .enter()
        .append('circle')
        .attr("cx", function(d) {
            return x(d.Fecha)
        })
        .attr("cy", function(d) {
            return y(+d.pendientes)
        })
        .attr("r", 3)
        .attr("opacity",0.95)
        .attr("visibility", function(d, i) {
            if (d.Fecha < mindate) return "hidden";
        })
        .style("fill", "steelblue")
        .on("mouseover", function(d) {
            tip.transition()
                .duration(200)
                .style("opacity", .9);
            tip.html("<h6>" + formatDay(d.Fecha) + "/" + formatMonth(d.Fecha) + "</h6>" +
                      " <p class='text-primary'> Pruebas pendientes" + "</p>" +
                      " <p class='text-primary'>" + (+d.pendientes).toLocaleString() + "</p>")
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

        var fase = svgT.append("line")
            .attr("x1", x(fase3))
            .attr("y1", y(y.domain()[0]))
            .attr("x2", x(fase3))
            .attr("y2", y(y.domain()[1]))
            .attr("stroke", "#000000")
            .style("stroke-width", 1)
            .style("fill", "none")
            .style("stroke-dasharray", "5,5");

        svgT.append("text")
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

        var fase = svgT.append("line")
            .attr("x1", x(fase12))
            .attr("y1", y(y.domain()[0]))
            .attr("x2", x(fase12))
            .attr("y2", y(y.domain()[1]))
            .attr("stroke", "#000000")
            .style("stroke-width", 1)
            .style("fill", "none")
            .style("stroke-dasharray", "5,5");

        svgT.append("text")
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

        var fase = svgT.append("line")
            .attr("x1", x(faseExt))
            .attr("y1", y(y.domain()[0]))
            .attr("x2", x(faseExt))
            .attr("y2", y(y.domain()[1]))
            .attr("stroke", "#000000")
            .style("stroke-width", 1)
            .style("fill", "none")
            .style("stroke-dasharray", "5,5");

        svgT.append("text")
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
    svgT.append('circle')
            .attr("cx", coordX-20)
            .attr("cy", coordY+110)
            .attr("r", 5)
            .attr("opacity",0.95)
            .style("fill", "darkorange")
    svgT.append("text").attr("x", coordX-12).attr("y", coordY+110).text("Pruebas negativas").style("font-size", "10px").attr("alignment-baseline","middle")

    //Leyenda Pendientes
    svgT.append('circle')
            .attr("cx", coordX-20)
            .attr("cy", coordY+130)
            .attr("r", 5)
            .attr("opacity",0.95)
            .style("fill", "steelblue")
    svgT.append("text").attr("x", coordX-12).attr("y", coordY+130).text("Pruebas pendientes").style("font-size", "10px").attr("alignment-baseline","middle")

    //Leyenda positivas
    svgT.append('circle')
            .attr("cx", coordX-20)
            .attr("cy", coordY+150)
            .attr("r", 5)
            .attr("opacity",0.95)
            .style("fill", "darkolivegreen")
    svgT.append("text").attr("x", coordX-12).attr("y", coordY+150).text("Pruebas positivas").style("font-size", "10px").attr("alignment-baseline","middle")
});
