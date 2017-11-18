function initMap() {
  var initialLocation = {lat: 38.164871, lng: -85.58541799999999};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: initialLocation
  });
  var card = document.getElementById('pac-card');
  var input = document.getElementById('pac-input');
  var types = document.getElementById('type-selector');
  var strictBounds = document.getElementById('strict-bounds-selector');
  //use locations from data.js for the markers
  //data generated from project.py script
  for( i = 0; i < markers.length; i++) {

    //load position from data.js
    var position = new google.maps.LatLng(markers[i]['location']['lat'], markers[i]['location']['lng']);

    //generate content string based on url
    console.log(markers[i].markerUrl);
    var contentString = "<div><img width='180px' src="
    + "'" + markers[i].markerUrl + "''"
    + "/></div>"
    + "<a style='width: 180px;' class='waves-effect waves-light btn modal-trigger' href='#modal2'>Resolve</a>";

    marker = new google.maps.Marker({
      position: position,
      map: map,
      title: markers[i]['description'],
    });
    marker.content = contentString;
    var infoWindow = new google.maps.InfoWindow();
    marker.addListener('click', function(){
      infoWindow.setContent(this.content);
      infoWindow.open(this.getMap(), this);
    });
  }
  // document.getElementById("submit-report").addEventListener("click", function(){
  //   var latitude = document.getElementById("latitude").value;
  //   var longitude = document.getElementById("longitude").value;
  //   var title = document.getElementById("title").value;
  //   console.log(latitude, longitude);
  //   var position = new google.maps.LatLng(latitude, longitude);
  //   addMarker(position, title);
  // });
  // // 38.185, -85.591749
  //
  // //need to ask sam how he added the url + pulled up image in the maps initialization
  // function addMarker(location, title) {
  //   var icon = new google.maps.Marker({
  //     position: location,
  //     map: map,
  //     title: title
  //   });
  //   markers.push(icon);
  //   console.log("successfully pushed marker");
  // }

  var card = document.getElementById('pac-card');
  var input = document.getElementById('pac-input');
  var types = document.getElementById('type-selector');
  var strictBounds = document.getElementById('strict-bounds-selector');

  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);

  var autocomplete = new google.maps.places.Autocomplete(input);

  // Bind the map's bounds (viewport) property to the autocomplete object,
  // so that the autocomplete requests use the current map bounds for the
  // bounds option in the request.
  autocomplete.bindTo('bounds', map);

  var infowindow = new google.maps.InfoWindow();
  var infowindowContent = document.getElementById('infowindow-content');
  infowindow.setContent(infowindowContent);
  var marker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, -29)
  });

  autocomplete.addListener('place_changed', function() {
    infowindow.close();
    marker.setVisible(false);
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      // map.fitBounds(place.geometry.viewport);
      map.setCenter(place.geometry.location);
    } else {
      map.setCenter(place.geometry.location);
    }
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);

    var address = '';
    if (place.address_components) {
      address = [
        (place.address_components[0] && place.address_components[0].short_name || ''),
        (place.address_components[1] && place.address_components[1].short_name || ''),
        (place.address_components[2] && place.address_components[2].short_name || '')
      ].join(' ');
    }

    infowindowContent.children['place-icon'].src = place.icon;
    infowindowContent.children['place-name'].textContent = place.name;
    infowindowContent.children['place-address'].textContent = address;
    infowindow.open(map, marker);
  });

  document.getElementById("form-btn-submit").addEventListener("click", function(){
    var title = document.getElementById("title-form").value;
    // var description = document.getElementById("description").value;
    console.log(autocomplete.location);
    console.log(title + ' ' + description);
    // var position = document.getElementById("location").value;
    // console.log(position);
    // addMarker(position, title);
  });
  // 38.185, -85.591749

  //need to ask sam how he added the url + pulled up image in the maps initialization
  function addMarker(location, title) {
    var icon = new google.maps.Marker({
      position: location,
      map: map,
      title: title
    });
    markers.push(icon);
    console.log("successfully pushed marker");
  };
}
