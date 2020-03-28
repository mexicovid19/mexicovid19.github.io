//set dimensions
var urlTotal = "https://raw.githubusercontent.com/LeonardoCastro/COVID19-Mexico/master/data/series_tiempo/covid19_mex_casos_totales.csv",
    urlRecu = "https://raw.githubusercontent.com/LeonardoCastro/COVID19-Mexico/master/data/series_tiempo/covid19_mex_recuperados.csv",
    w = 700,
    h = 400;
    var w = $(".page-content").width(); //map.node().getBoundingClientRect().width;
    var h = w / 2;
/*var  adjust = window.innerWidth;
$('#mapa').scrollLeft(adjust/2);*/
var navMap = d3.select("#mapa").append("div") 
    .attr("class", "nav_map")       
    .style("opacity", 0);

//define projection
var projection = d3.geoMercator()
    .center([-100, 22])
    .translate([w / 1.85, h / 1.7])
    .scale([w / .7]);

//define path generator
var path = d3.geoPath()
    .projection(projection)

//svg
var mapSvg = d3.select("#mapa")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

//load GeoJson data
d3.json("https://raw.githubusercontent.com/LeonardoCastro/COVID-20/master/assets/javascript/mexico.geojson", function(json) {
    feat = json.features;
    // bind data
    mapSvg.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .on("mouseover", function(d) { 
          d.properties.updated_at = new Date(d.properties.updated_at) ;
           formatMonth = d3.timeFormat("%b"), //%m
    formatDay = d3.timeFormat("%d"),
    formatHour=d3.timeFormat("%H"),
    formatMin=d3.timeFormat("%M");
            navMap.transition()    
                .duration(200)    
                .style("opacity", .9);    
            navMap.html("<h6>" + d.properties.name + "</h6>"+ "<p class='text-danger'> Totales: " 
              + d.properties.totales + "</p>" + "<p class='text-warning'> <span style='color:#fd7e14 !important;'>Activos: " 
               + d.properties.activos + "</span></p>"+"<p class='text-primary'> Muertes: " + d.properties.muertes + "</p>"
                +"<p><small>Actualizado el: "+formatDay(d.properties.updated_at)+ "/"+formatMonth(d.properties.updated_at)+
                " @ "+formatHour(d.properties.updated_at)+":"+formatMin(d.properties.updated_at)+ "</small></p>")  
                .style("left", (d3.event.pageX) + "px")   
                .style("top", (d3.event.pageY - 28) + "px");  
            })          
        .on("mouseout", function(d) {   
            navMap.transition()    
                .duration(500)    
                .style("opacity", 0); 
        });


});


