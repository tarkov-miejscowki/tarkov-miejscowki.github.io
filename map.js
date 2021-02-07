var map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: -3
});

var bounds = [[0,0], [1986,3820]];
var image = L.imageOverlay('maps/customs.png', bounds).addTo(map);
map.fitBounds(bounds);


// forteca
var polygon = L.polygon([[634, 1959],[653, 2066],[433, 2105],[411, 2000]], {color: 'blue'}).addTo(map);
var marker = new L.marker([543, 2032.5], { opacity: 0.01 });
marker.bindTooltip("Forteca", {
    permanent: true, 
    className: "my-label", 
    offset: [0, 0], 
    direction: 'bottom',
    sticky: true });
marker.addTo(map);

// czerwony
var polygon2 = L.polygon([[684, 492],[679, 611],[455, 604],[460, 485]], {color: 'red'}).addTo(map);
var marker2 = new L.marker([581, 545], { opacity: 0.01 });
marker2.bindTooltip("Czerwony", {
    permanent: true, 
    className: "my-label", 
    offset: [0, 0], 
    direction: 'bottom',
    sticky: true });
marker2.addTo(map);

map.on('click', function(e){
    var coord = e.latlng;
    var lat = coord.lat;
    var lng = coord.lng;
    console.log("y: " + lat + " x: " + lng);
});