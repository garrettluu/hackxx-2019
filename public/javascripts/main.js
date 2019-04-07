var map;
var destinationMarker;

var dest;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 0, lng: 0},
        zoom: 14
    });

    getLocationForMap();
}

function updateMap(location) {
     map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: location.lat, lng: location.long},
        zoom: 14
    });

    var marker = new google.maps.Marker({
        position: {lat: location.lat, lng: location.long},
        map: map,
        title: 'Current Location'
    });
}

function searchPlace() {
    var query = document.getElementById('dest').value;
    var request = {
        query: query,
        fields: ['name', 'geometry'],
    };

    var service = new google.maps.places.PlacesService(map);

    service.findPlaceFromQuery(request, function(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                createMarker(results[i]);
            }
            map.setCenter(results[0].geometry.location);
            dest = new Location(results[0].geometry.location.lat(), results[0].geometry.location.lng());
            console.log(dest);
        }
    });
}
function createMarker(place) {
    destinationMarker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });

    google.maps.event.addListener(destinationMarker, 'click', function() {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
}

function Location(lat, long) {
    this.lat = lat;
    this.long = long;
}

function getLocationForMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position => {
            var loc = new Location(position.coords.latitude, position.coords.longitude);
            updateMap(loc)
        }))
    }
}

function getLocationForRide() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            var loc = new Location(position.coords.latitude, position.coords.longitude);
            var seats = document.getElementById('seats-num').value;
            newRide(loc, dest, seats);
        })
    } else {
        // Geolocation not supported
        // TODO: show message to user
        console.log("Geolocation not available");
    }
}

function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://localhost:3000/tokensignin');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function() {
        console.log('Signed in as: ' + xhr.responseText);
    };
    xhr.send('idtoken=' + id_token);
}

function newRide(location, destination, seats) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", '/newride', true);
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(JSON.stringify({
        "userId": "twonder",
        "name": "Tracker Wonderdog",
        "location": location,
        "destination": destination,
        "seats": seats
    }));
}

function refreshRides() {
    console.log("Refreshed");
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // Typical action to be performed when the document is ready:
            removeDriverDiv();
            var jsonObj = JSON.parse(xmlhttp.responseText);
            for (var key in jsonObj) {
                if (jsonObj.hasOwnProperty(key)) {
                    console.log(jsonObj[key]);
                    var driver = jsonObj[key];
                    buildDriverDiv(driver.name, driver.seats)
                }
            }
            // console.log(jsonObj.valueOf());

        }
    };
    xmlhttp.open("GET", '/update', true);
    xmlhttp.send();
}

function buildDriverDiv(name, seats) {
    //Create outer div
    var outerDiv = document.createElement('div');
    outerDiv.className = 'drivers';
    //Append to container
    document.getElementById('driver-container').appendChild(outerDiv);

    var driverData = document.createElement('div');
    driverData.className = 'left_divider';

    outerDiv.appendChild(driverData);

    var nameText = document.createElement('h3');
    nameText.innerText = name;
    driverData.appendChild(nameText);

    var seatsText = document.createElement('p');
    seatsText.innerText = "Remaining Seats: " + seats;
    driverData.appendChild(seatsText);

    var reserveButton = document.createElement('button');
    reserveButton.innerText = "Reserve";
    driverData.appendChild(reserveButton);
}

function removeDriverDiv() {
  var removeVar = document.getElementById("driver-container");
  while (removeVar.firstChild) {
    removeVar.removeChild(removeVar.firstChild);
  }
}
// function removeDriverDiv() {
//   var removeVar = document.getElementsByClassName('drivers');
//   var i;
//   for (i = 0; i < removeVar.length; i++) {
//     removeVar[i].parentNode.removeChild(removeVar[i]);
//   }
// }
