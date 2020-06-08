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
var url = "https://raw.githubusercontent.com/mexicovid19/Mexico-datos/master/datos_abiertos/formato_especial/comparativo_muertes_acumuladas.csv";

var tip = d3.select("#grafica_comparativo_muertes").append("div")
            .attr("class", "tip")
            .style("opacity", 0);

            d3.select("#grafica_comparativo_muertes").append('style')
            .text('svg {max-width:100%}')

var svgC = d3.select("#grafica_comparativo_muertes")
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
        d.Nuevas_JH = +d.Nuevas_JH;
        d.Nuevas_abiertos = +d.Nuevas_abiertos;
    });

    // define the x scale (horizontal)
    var today = new Date();
        formatMonth = d3.timeFormat("%b"), //%m
        formatDay = d3.timeFormat("%d");


        formatMes = d3.timeFormat("%b"),
        formatDia = d3.timeFormat("%d");

    var mindate = new Date(2020, 1, 19);
    // Add X axis --> it is a date format
    var x = d3.scaleTime()
        .domain([mindate, data[tope]['Fecha']])
        .range([0, w]);//width - 10]);


    svgC.append("g")
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
                  return +d.Nuevas_JH;
              }) * 1.1])
              .range([h, 0]);//height - 10

    svgC.append("g")
        .call(d3.axisLeft(y));

    svgC.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "mediumorchid")
        .attr("stroke-width", 3.0)
        .attr("d", d3.line()
          .x(function(d) { return x(+d.Fecha) })
          .y(function(d) { return y(+d.Nuevas_JH) })
          )

    svgC.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "darkorange")
        .attr("stroke-width", 3.0)
        .attr("d", d3.line()
          .x(function(d) { return x(+d.Fecha) })
          .y(function(d) { return y(+d.Nuevas_abiertos) })
          )

        // Puntos de datos Negativas
        var dot = svgC.selectAll('dot')
            .data(data)
            .enter()
            .append('circle')
            .attr("cx", function(d) {
                return x(d.Fecha)
            })
            .attr("cy", function(d) {
                return y(+d.Nuevas_abiertos)
            })
            .attr("r", 3)
            .attr("opacity",0.95)
            .style("fill", "darkorange")
            .on("mouseover", function(d) {
                tip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tip.html("<h6>" + formatDay(d.Fecha) + "/" + formatMonth(d.Fecha) + "</h6>" +
                          " <p class='text-primary'> Defunciones" + "</p>" +
                          " <p class='text-primary'>" + d.Nuevas_abiertos + "</p>")
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 30) + "px");
            })
            .on("mouseout", function(d) {
                tip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });


    // Puntos de datos Pendientes
    var dot = svgC.selectAll('dot')
        .data(data)
        .enter()
        .append('circle')
        .attr("cx", function(d) {
            return x(d.Fecha)
        })
        .attr("cy", function(d) {
            return y(+d.Nuevas_JH)
        })
        .attr("r", 3)
        .attr("opacity",0.95)
        .style("fill", "mediumorchid")
        .on("mouseover", function(d) {
            tip.transition()
                .duration(200)
                .style("opacity", .9);
            tip.html("<h6>" + formatDay(d.Fecha) + "/" + formatMonth(d.Fecha) + "</h6>" +
                      " <p class='text-primary'> Defunciones reportadas" + "</p>" +
                      " <p class='text-primary'>" + d.Nuevas_JH + "</p>")
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

    var fase = svgC.append("line")
        .attr("x1", x(fase3))
        .attr("y1", y(y.domain()[0]))
        .attr("x2", x(fase3))
        .attr("y2", y(y.domain()[1])+17)
        .attr("stroke", "#000000")
        .style("stroke-width", 1)
        .style("fill", "none")
        .style("stroke-dasharray", "5,5");

    svgC.append("text")
        .attr("y", y(y.domain()[1]))
        .attr("x", x(fase3) - 50)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size","10px")
        .text("Comienza la fase 3")
        .attr("stroke", "#000000")
        .attr("font-family", "sans-serif");

    //Fase 2
    var fase12 = new Date(2020, 2, 23);

    var fase = svgC.append("line")
        .attr("x1", x(fase12))
        .attr("y1", y(y.domain()[0]))
        .attr("x2", x(fase12))
        .attr("y2", y(y.domain()[1])+57)
        .attr("stroke", "#000000")
        .style("stroke-width", 1)
        .style("fill", "none")
        .style("stroke-dasharray", "5,5");

    svgC.append("text")
        .attr("y", y(y.domain()[1])+40)
        .attr("x", x(fase12) - 5)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size","10px")
        .text("Comienza la fase 2")
        .attr("stroke", "#000000")
        .attr("font-family", "sans-serif");

    //Emergencia sanitaria
    var faseExt=new Date(2020, 2, 30);;

    var fase = svgC.append("line")
        .attr("x1", x(faseExt))
        .attr("y1", y(y.domain()[0]))
        .attr("x2", x(faseExt))
        .attr("y2", y(y.domain()[1])+37)
        .attr("stroke", "#000000")
        .style("stroke-width", 1)
        .style("fill", "none")
        .style("stroke-dasharray", "5,5");

    svgC.append("text")
        .attr("y", y(y.domain()[1])+20)
        .attr("x", x(faseExt) - 5)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size","10px")
        .text("Emergencia sanitaria")
        .attr("stroke", "#000000")
        .attr("font-family", "sans-serif");


     //Leyenda
    var coordX =(x(x.domain()[1])-(margin.left+margin.right))*0.15,
        coordY =  (y(y.domain()[1])+margin.top+25);
        offset=30;


    //Leyenda Negativas
    svgC.append('circle')
            .attr("cx", coordX-20)
            .attr("cy", coordY+40)
            .attr("r", 5)
            .attr("opacity",0.95)
            .style("fill", "darkorange")
    svgC.append("text").attr("x", coordX-12).attr("y", coordY+40).text("Datos abiertos").style("font-size", "10px").attr("alignment-baseline","middle")

    //Leyenda Pendientes
    svgC.append('circle')
            .attr("cx", coordX-20)
            .attr("cy", coordY+60)
            .attr("r", 5)
            .attr("opacity",0.95)
            .style("fill", "mediumorchid")
    svgC.append("text").attr("x", coordX-12).attr("y", coordY+60).text("John Hopkins").style("font-size", "10px").attr("alignment-baseline","middle")

});
