// SUMMON
// URL
var urlTotal="https://raw.githubusercontent.com/mexicovid19/Mexico-datos/master/datos/series_de_tiempo/covid19_mex_confirmados.csv",
   urlRecu="https://raw.githubusercontent.com/mexicovid19/Mexico-datos/master/datos/series_de_tiempo/covid19_mex_recuperados.csv",
   urlActivos="https://raw.githubusercontent.com/mexicovid19/Mexico-datos/master/datos/series_de_tiempo/covid19_mex_casos_activos.csv",
   urlMuertes="https://raw.githubusercontent.com/mexicovid19/Mexico-datos/master/datos/series_de_tiempo/covid19_mex_muertes.csv",
   urlMuertesNuevas="https://raw.githubusercontent.com/mexicovid19/Mexico-datos/master/datos/series_de_tiempo/covid19_mex_muertes_nuevas.csv",
   urlNuevos="https://raw.githubusercontent.com/mexicovid19/Mexico-datos/master/datos/series_de_tiempo/covid19_mex_casos_nuevos.csv",
   urlUpdateTime="https://raw.githubusercontent.com/mexicovid19/Mexico-datos/master/datos/last_updated.csv";

//totales
d3.csv(urlTotal,function(data) {
  var largo = data.length;
  var tope =largo-1;
  var div = document.getElementById('totales');
     div.innerHTML = data[tope]["Nacional"];
  });
/*
d3.csv(urlRecu,function(data) {
  var largo = data.length;
  var tope =largo-1;
  var div = document.getElementById('recuperados');
      div.innerHTML = data[tope]["Nacional"];
  });

d3.csv(urlMuertesNuevas,function(data) {
  var largo = data.length;
  var tope =largo-1;
  var div = document.getElementById('muertes_nuevas');
      div.innerHTML = data[tope]["Nacional"];
  });
*/

d3.csv(urlMuertes,function(data) {
  var largo = data.length;
  var tope =largo-1;
  var div = document.getElementById('muertes');
      div.innerHTML = data[tope]["Nacional"];
  });

d3.csv(urlNuevos,function(data) {
  var largo = data.length;
  var tope =largo-1;
  var div = document.getElementById('nuevos');
      div.innerHTML = data[tope]["Nacional"];
  });

  d3.csv(urlUpdateTime,function(data) {
    formatMonth = d3.timeFormat("%b"), //%m
    formatDay = d3.timeFormat("%d"),
    formatHour=d3.timeFormat("%H"),
    formatMin=d3.timeFormat("%M");
    var largo = data.length;
    var tope = largo-1;
    data[tope]["updated_at"] = new Date(data[tope]["updated_at"]) ;
    for (var i = 0 ; i <= 6; i++) {
      var div = document.getElementById('tiempo_actualizacion_'+i);
       div.innerHTML = "<p class='text-center'><small>Actualizado el: "+formatDay(data[tope]["updated_at"])+ "/"+formatMonth(data[tope]["updated_at"])+
       " @ "+formatHour(data[tope]["updated_at"])+":"+formatMin(data[tope]["updated_at"])+ "</small></p>";
    }
   /*
   var div = document.getElementById('tiempo_actualizacion_1');
      div.innerHTML = "<p><small>Actualizado el: "+formatDay(data[tope]["updated_at"])+ "/"+formatMonth(data[tope]["updated_at"])+
      " @ "+formatHour(data[tope]["updated_at"])+":"+formatMin(data[tope]["updated_at"])+ "</small></p>";
    var div = document.getElementById('tiempo_actualizacion_2');
       div.innerHTML = "<p><small>Actualizado el: "+formatDay(data[tope]["updated_at"])+ "/"+formatMonth(data[tope]["updated_at"])+
       " @ "+formatHour(data[tope]["updated_at"])+":"+formatMin(data[tope]["updated_at"])+ "</small></p>";
       var div = document.getElementById('tiempo_actualizacion_2');
       div.innerHTML = "<p><small>Actualizado el: "+formatDay(data[tope]["updated_at"])+ "/"+formatMonth(data[tope]["updated_at"])+
       " @ "+formatHour(data[tope]["updated_at"])+":"+formatMin(data[tope]["updated_at"])+ "</small></p>";*/
    });
