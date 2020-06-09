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
var url = "https://raw.githubusercontent.com/mexicovid19/Mexico-datos/master/datos/series_de_tiempo/covid19_mex_muertes.csv";

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

//Read the data
d3.csv(url, function(data) {
    console.log(data);
    var tope = data.length - 1;

    data.forEach(function(d) {
        d.Fecha = new Date(d.Fecha);
        d.Nacional = +d.Nacional;
    });

    // define the x scale (horizontal)

    var today = new Date();
    formatMonth = d3.timeFormat("%b"), //%m
        formatDay = d3.timeFormat("%d");


    formatMes = d3.timeFormat("%b"),
        formatDia = d3.timeFormat("%d");

    var mindate = new Date(2020, 2, 18);
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

    var fase12 = new Date(2020, 2, 23);


    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) {
            return +d.Nacional;
        }) * 1.1])
        .range([h, 0]);//height - 10
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
            return y(+d.Nacional)
        })
        .attr("r", 5)
        .attr("opacity",0.7)
        .attr("visibility", function(d, i) {
            if (d.Nacional == 0) return "hidden";
        })
        .style("fill", "mediumorchid")
        .on("mouseover", function(d) {
            tip.transition()
                .duration(200)
                .style("opacity", .9);
            tip.html("<h6>" + formatDay(d.Fecha) + "/" + formatMonth(d.Fecha) + "</h6>" + " <p class='text-primary'>" + (+d.Nacional).toLocaleString() + "</p>")
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
            .attr("y2", y(y.domain()[1])+17)
            .attr("stroke", "#000000")
            .style("stroke-width", 1)
            .style("fill", "none")
            .style("stroke-dasharray", "5,5");

        svgT.append("text")
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

        var fase = svgT.append("line")
            .attr("x1", x(fase12))
            .attr("y1", y(y.domain()[0]))
            .attr("x2", x(fase12))
            .attr("y2", y(y.domain()[1])+57)
            .attr("stroke", "#000000")
            .style("stroke-width", 1)
            .style("fill", "none")
            .style("stroke-dasharray", "5,5");

        svgT.append("text")
            .attr("y", y(y.domain()[1])+40)
            .attr("x", x(fase12)+35)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .style("font-size","10px")
            .text("Comienza la fase 2")
            .attr("stroke", "#000000")
            .attr("font-family", "sans-serif");

        //Emergencia sanitaria
        var faseExt=new Date(2020, 2, 30);;

        var fase = svgT.append("line")
            .attr("x1", x(faseExt))
            .attr("y1", y(y.domain()[0]))
            .attr("x2", x(faseExt))
            .attr("y2", y(y.domain()[1])+37)
            .attr("stroke", "#000000")
            .style("stroke-width", 1)
            .style("fill", "none")
            .style("stroke-dasharray", "5,5");

        svgT.append("text")
            .attr("y", y(y.domain()[1])+20)
            .attr("x", x(faseExt)+30)
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

//Leyenda datos SSA
svgT.append('circle')
        .attr("cx", coordX-20)
        .attr("cy", coordY-20)
        .attr("r", 5)
        .attr("opacity",0.7)
        .style("fill", "mediumorchid")
svgT.append("text").attr("x", coordX-12).attr("y", coordY-20).text("Datos SSA").style("font-size", "10px").attr("alignment-baseline","middle")

    // Animation
    /* Add 'curtain' rectangle to hide entire graph */
    var curtain = svgT.append('rect')
        .attr('x', -1 * w_full)//width
        .attr('y', -1 * y(y.domain()[0]))//height
        .attr('height', y(y.domain()[0]))//height
        .attr('width', w_full)//width
        .attr('class', 'curtain')
        .attr('transform', 'rotate(180)')
        .style('fill', '#ffffff');

    /* Optionally add a guideline */
    var guideline = svgT.append('line')
        .attr('stroke', '#333')
        .attr('stroke-width', 0)
        .attr('class', 'guide')
        .attr('x1', 1)
        .attr('y1', 1)
        .attr('x2', 1)
        .attr('y2', h_full)//height

    /* Create a shared transition for anything we're animating */
    var t = svgT.transition()
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
        .attr('transform', 'translate(' + w + ', 0)')//width

    d3.select("#show_guideline").on("change", function(e) {
        guideline.attr('stroke-width', this.checked ? 1 : 0);
        curtain.attr("opacity", this.checked ? 0.75 : 1);
    })

});
