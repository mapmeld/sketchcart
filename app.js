d3.json("data.geojson", loadStreets);

function loadStreets(error, streets) {
  if (error) {
    return console.error(error);
  }
  var svg = d3.select("body").append("svg")
    .attr("id", "map")
    .attr("width", 800)
    .attr("height", 800);

  // change these to change the center of your map
  var longitude = -73.953;
  var latitude = 40.7573;

  var nyc_projection = d3.geo.mercator()
    .center([longitude, latitude])
    .scale(2800000)
    .translate([400, 400]);

  svg.append("path")
    .datum(streets)
    .attr("id", "test")
    .attr("d", d3.geo.path().projection(nyc_projection));

  var ww = new Walkway({
    selector: '#map',
    duration: '7000'
  });
  ww.draw();
}
