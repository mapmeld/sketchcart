
L.mapbox.accessToken = 'pk.eyJ1IjoibWFwbWVsZCIsImEiOiI0a1NzYW53In0.2gQTd6k9Ghw8UBK4DsciLA';

var init_lat = 40.441427;
var init_lng = -80.010069;
var init_zoom = 16;
if(window.location.href.indexOf("#map=") > -1){
  var spot = window.location.href.split("#map=")[1].split("/");
  init_zoom = spot[0] * 1 || init_zoom;
  init_lat = spot[1] * 1 || init_lat;
  spot[2] = spot[2].replace(/[A-z]+/,"").replace("&","");
  init_lng = spot[2] * 1 || init_lng;
}

var map = L.mapbox.map("map")
  .setView([init_lat, init_lng], init_zoom)
  .addControl(L.mapbox.geocoderControl('mapmeld.map-x20zuxfw'))
  .addControl(L.mapbox.shareControl());

map.on('moveend', function(){
  parent.location.hash = "map="
  + map.getZoom()
  + "/" + map.getCenter().lat.toFixed(6)
  + "/" + map.getCenter().lng.toFixed(6);
});

// Add a fake GeoJSON line to coerce Leaflet into creating the <svg> tag that d3_geoJson needs
new L.geoJson({"type": "LineString","coordinates":[[0,0],[0,0]]}).addTo(map);

$("#map").append($("<div>").css({ position: "fixed", background: "#ccc", opacity: 0.85, bottom: 0, right: 0 }).html("Data &copy 2015 OpenStreetMap contributors - Vector Tiles from OSM US - Drawn by <a href='https://github.com/mapmeld/sketchcart'>sketchcart</a> Written by <a href='https://twitter.com/mapmeld'>@mapmeld</a>"));

L.TileLayer.d3_geoJSON =  L.TileLayer.extend({
  onAdd : function(map) {
    L.TileLayer.prototype.onAdd.call(this,map);
    this._path = d3.geo.path().projection(function(d) {
      var point = map.latLngToLayerPoint(new L.LatLng(d[1],d[0]));
      return [point.x,point.y];
    });
    this.on("tileunload",function(d) {
      if (d.tile.xhr) d.tile.xhr.abort();
      if (d.tile.nodes) d.tile.nodes.remove();
      d.tile.nodes = null;
      d.tile.xhr = null;
    });
  },
  _loadTile : function(tile,tilePoint) {
    var self = this;
    this._adjustTilePoint(tilePoint);

    if (!tile.nodes && !tile.xhr) {
      tile.xhr = d3.json(this.getTileUrl(tilePoint),function(geoJson) {
        tile.xhr = null;
        tile.nodes = d3.select(map._container).select("svg").append("g");
        tile.nodes.attr("id", "m" + tilePoint.x + "-" + tilePoint.y + "-" + tilePoint.z);
        tile.nodes.selectAll("path")
          .data(geoJson.features).enter()
          .append("path")
          .attr("d", self._path)
          .attr("class", self.options.class)
          .attr("style", self.options.style);
        var ww = new Walkway({
          selector: '#m' + tilePoint.x + "-" + tilePoint.y + "-" + tilePoint.z,
          duration: '3500'
        });
        ww.draw();
      });
    }
  }
});

new L.TileLayer.d3_geoJSON("http://tile.openstreetmap.us/vectiles-highroad/{z}/{x}/{y}.json", {
  class: "road",
  style: function(d) { return "stroke: #000; stroke-width: 1.5;"; }
}).addTo(map);
