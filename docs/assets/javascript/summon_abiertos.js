// SUMMON
// URL

var urlUpdateTime="https://raw.githubusercontent.com/mexicovid19/Mexico-datos/master/datos/last_updated.csv";

d3.csv(urlUpdateTime,function(data) {
  formatMonth = d3.timeFormat("%b"), //%m
  formatDay = d3.timeFormat("%d"),
  formatHour=d3.timeFormat("%H"),
  formatMin=d3.timeFormat("%M");
  var largo = data.length;
  var tope = largo-1;
  data[tope]["updated_at"] = new Date(data[tope]["updated_at"]) ;
  for (var i = 0 ; i < 2; i++) {
    var div = document.getElementById('tiempo_actualizacion_'+i);
     div.innerHTML = "<p class='text-center'><small>Actualizado el: "+formatDay(data[tope]["updated_at"])+ "/"+formatMonth(data[tope]["updated_at"])+
     " @ "+formatHour(data[tope]["updated_at"])+":"+formatMin(data[tope]["updated_at"])+ "</small></p>";
  }
});
