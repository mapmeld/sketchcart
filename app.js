d3.json("data.geojson", function(error, streets) {
  if (error) {
    return console.error(error);
  }
  console.log(streets);
});
