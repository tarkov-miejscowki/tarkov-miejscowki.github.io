var locations;

var map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: -3
});

var bounds = [[0,0], [1986,3820]];
var image = L.imageOverlay('maps/customs.png', bounds).addTo(map);
map.fitBounds(bounds);

map.on('click', function(e){
    var coord = e.latlng;
    var lat = coord.lat;
    var lng = coord.lng;
    console.log("y: " + lat + " x: " + lng);
});

fetch('./locations/customs.json')
.then(response => response.json())
.then(json => {
    locations = json;
    for (const location of locations) {
        if (location.radius > 0) {
            L.circle(location.point, {radius: location.radius, color: location.color}).addTo(map);
        } else {
            L.polygon(location.corners, {color: location.color}).addTo(map);
        }
        let marker = new L.marker(location.point, { opacity: 0.01 });
        marker.bindTooltip(location.name, {
            permanent: true, 
            className: "my-label", 
            offset: [0, 0], 
            direction: 'top',
            sticky: true });
        marker.addTo(map);
    }
});