var newLocation = {
    dom: {
        name: document.getElementById('new-location-name'),
        color: document.getElementById('new-location-color'),
        point: document.getElementById('new-location-point'),
        radius: document.getElementById('new-location-radius'),
        corners: document.getElementById('new-location-corners'),
        pointSet: document.getElementById('new-location-point-set'),
        radiusSet: document.getElementById('new-location-radius-set'),
        cornersSet: document.getElementById('new-location-corners-set'),
        addButton: document.getElementById('new-location-add')
    },
    requests: {
        point: false, radius: false, corners: false
    },
    data: {
        point: null, radius: null, corners: null
    },
    dummyArea: null
};

newLocation.dom.pointSet.addEventListener('click', e => {
    if(newLocation.requests.radius || newLocation.requests.corners) return;

    newLocation.requests.point = true;
    newLocation.dom.point.innerHTML = 'Punkt: ✘';
});

newLocation.dom.radiusSet.addEventListener('click', e => {
    if(newLocation.requests.point || newLocation.requests.corners) return;

    if (newLocation.data.point == null) {
        alert('Najpierw musisz ustawić punkt');
        return;
    }

    if (newLocation.requests.radius) {
        newLocation.requests.radius = false;
        newLocation.dom.radiusSet.innerHTML = 'Ustaw promień';
        if (newLocation.dummyArea) {
            map.removeLayer(newLocation.dummyArea);
        }
    } else {
        newLocation.data.corners = null;
        newLocation.dom.corners.innerHTML = 'Rogi: 0';

        newLocation.requests.radius = true;
        newLocation.dom.radius.innerHTML = 'Promień: 0';
        newLocation.dom.radiusSet.innerHTML = 'Zapisz promień';
    }
});

newLocation.dom.cornersSet.addEventListener('click', e => {
    if(newLocation.requests.point || newLocation.requests.radius) return;

    if (newLocation.requests.corners) {
        newLocation.requests.corners = false;
        newLocation.dom.cornersSet.innerHTML = 'Ustaw rogi';
        if (newLocation.dummyArea) {
            map.removeLayer(newLocation.dummyArea);
        }
    } else {
        newLocation.requests.corners = true;
        newLocation.data.radius = 0;
        newLocation.dom.radius.innerHTML = 'Promień: 0';

        newLocation.data.corners = null;
        newLocation.dom.corners.innerHTML = 'Rogi: 0';
        newLocation.dom.cornersSet.innerHTML = 'Zapisz rogi';
    }
});

newLocation.dom.addButton.addEventListener('click', e => {
    let location = {
        name: newLocation.dom.name.value,
        color: newLocation.dom.color.value,
        point: newLocation.data.point,
        radius: newLocation.data.radius
    };
    if (location.radius == 0) {
        location.corners = newLocation.data.corners;
    }
    addLocation(location);
});

function mapOnClick(e) {
    var coord = e.latlng;

    if (newLocation.requests.point) {
        newLocation.requests.point = false;
        newLocation.data.point = [coord.lat, coord.lng];
        newLocation.dom.point.innerHTML = 'Punkt: ✓';
    }
    else if (newLocation.requests.radius) {
        let point = newLocation.data.point;
        newLocation.data.radius = Math.round(Math.sqrt(Math.pow(coord.lat - point[0], 2) + Math.pow(coord.lng - point[1], 2)));
        newLocation.dom.radius.innerHTML = 'Promień: ' + newLocation.data.radius;
        dummyCircle();
    }
    else if (newLocation.requests.corners) {
        newLocation.data.corners.push([coord.lat, coord.lng]);
        newLocation.dom.corners.innerHTML = 'Rogi: ' + newLocation.data.corners.length;
        dummyCorners();
    }
}

function dummyCorners() {
    if (newLocation.dummyArea) {
        map.removeLayer(newLocation.dummyArea);
    }
    
    newLocation.dummyArea = L.polygon(newLocation.data.corners, {
        color: newLocation.dom.color.value ? newLocation.dom.color.value : 'black'
    });
    newLocation.dummyArea.addTo(map);
}

function dummyCircle() {
    if (newLocation.dummyArea) {
        map.removeLayer(newLocation.dummyArea);
    }
    
    newLocation.dummyArea = L.circle(newLocation.data.point, {
        radius: newLocation.data.radius,
        color: newLocation.dom.color.value ? newLocation.dom.color.value : 'black'
    });
    newLocation.dummyArea.addTo(map);
}