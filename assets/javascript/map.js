 function moveMapToUk(map){
  map.setCenter({lat:51.5074, lng:-0.12});
  map.setZoom(13);
}

//Step 1: initialize communication with the platform
var platform = new H.service.Platform({
  apikey: "qvZeWsdAQvGnl_hbLJ0ttHuzIMdUifdobJGAWgi51ig"
});
var defaultLayers = platform.createDefaultLayers();

//Step 2: initialize a map - this map is centered over Europe
var map = new H.Map(document.getElementById('map'),
  defaultLayers.vector.normal.map,{
  center: {lat:50, lng:5},
  zoom: 4,
  pixelRatio: window.devicePixelRatio || 1
});
window.addEventListener('resize', () => map.getViewPort().resize()); // add a resize listener to make sure that the map occupies the whole container

// Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

var ui = H.ui.UI.createDefault(map, defaultLayers); // Create the default UI components

// Now use the map as required...
window.onload = function () {
  moveMapToUk(map);
}