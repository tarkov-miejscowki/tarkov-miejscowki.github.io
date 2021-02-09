var map, currentMapInfo, locationsList;
var locationsDomList = document.getElementById('locations-list');

function reloadFromFile(mapName, x, y) {
    currentMapInfo = {
        name: mapName,
        dimensions: [y, x]
    }

    document.getElementById("map").outerHTML = '<div id="map"></div>';
    locationsDomList.innerHTML = '';

    fetch(`./locations/${currentMapInfo.name}.json`, {
        headers: {
          'Cache-Control': 'no-cache',
          'pragma': 'no-cache',
          'cache-control': 'no-store'
        }
      })
    .then(response => response.json())
    .then(json => reload(json));

    document.getElementById('maps').style.display = 'none';
}

function reload(locations) {
    map = L.map('map', {
        crs: L.CRS.Simple,
        minZoom: -3
    });
    
    var bounds = [[0,0], currentMapInfo.dimensions];
    L.imageOverlay(`maps/${currentMapInfo.name}.png`, bounds).addTo(map);
    map.fitBounds(bounds);

    locationsList = [];
    for (const location of locations) {
        addLocation(location);
    }

    map.on('click', e => mapOnClick(e));
}

function addLocation(location) {
    let area;
    if (location.radius > 0) {
        area = L.circle(location.point, {radius: location.radius, color: location.color});
    } else {
        area = L.polygon(location.corners, {color: location.color});
    }

    let marker = new L.marker(location.point, { opacity: 0.01 });
    marker.bindTooltip(location.name, {
        permanent: true, 
        className: "my-label", 
        offset: [0, 0], 
        direction: 'top',
        sticky: true 
    });

    area.addTo(map);
    marker.addTo(map);
    locationsList.push([location, area, marker]);
    addLocationToDomList(location, area, marker);
}

function addLocationToDomList(location, area, marker) {
    var li = document.createElement('li');

    var span = document.createElement('span');
    span.appendChild(document.createTextNode(location.name));

    var loadButton = document.createElement('button');
    loadButton.appendChild(document.createTextNode('Załaduj'));

    var removeButton = document.createElement('button');
    removeButton.appendChild(document.createTextNode('Usuń'));

    li.appendChild(span);
    li.appendChild(loadButton);
    li.appendChild(removeButton);

    locationsDomList.appendChild(li);

    loadButton.addEventListener('click', e => {
        newLocation.requests = {
            point: false, radius: false, corners: false
        };
        newLocation.data = {
            point: location.point, radius: location.radius, corners: location.corners ? location.corners : null
        };

        newLocation.dom.name.value = location.name;
        newLocation.dom.color.value = location.color;
        newLocation.dom.point.innerHTML = 'Punkt: ✓';
        newLocation.dom.radius.innerHTML = 'Promień: ' + location.radius;
        newLocation.dom.corners.innerHTML = 'Rogi: ' + (location.corners ? location.corners.length : 0);
    });

    removeButton.addEventListener('click', e => {
        locationsDomList.removeChild(li);
        map.removeLayer(area);
        map.removeLayer(marker);

        for( var i = 0; i < locationsList.length; i++){                
            if (locationsList[i][0] === location) { 
                locationsList.splice(i, 1);
                break;
            }
        }
    });
}

document.getElementById('list-copy').addEventListener('click', e => {
    let arr = [];
    locationsList.forEach(element => {
        arr.push(element[0]);
    });
    navigator.clipboard.writeText(JSON.stringify(arr));
});

document.getElementById('list-load').addEventListener('click', e => {
    document.getElementById("map").outerHTML = '<div id="map"></div>';
    locationsDomList.innerHTML = '';
    navigator.clipboard.readText().then(
        clipText => reload(JSON.parse(clipText))
    );
});