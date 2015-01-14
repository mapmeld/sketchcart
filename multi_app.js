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

  var loadThree = function(i) {
    if (i >= streets.features.length) {
      return;
    }

    var street_features = {
      type: "FeatureCollection",
      features: streets.features.slice(i, i + 3)
    }

    svg.append("g")
      .attr("id", "map_" + i)
      .append("path")
        .datum(street_features)
        .attr("d", d3.geo.path().projection(nyc_projection));

    var ww = new Walkway({
      selector: '#map_' + i,
      duration: '200'
    });

    ww.draw(function() {
      loadThree(i + 3);
    });
  };

  loadThree(0);
}
