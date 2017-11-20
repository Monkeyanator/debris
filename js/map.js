function initMap() {

  //initialize map
  var initialLocation = {lat: 38.164871, lng: -85.58541799999999};
  window.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: initialLocation
  });

  window.RED_MARKER_URL = "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_red.png";
  window.YELLOW_MARKER_URL = "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_yellow.png";
  window.previousInfoWindow = null;
  window.INITIALIZING = true;

  //get reference for all the UI elements
  //pac-card should be invisible by default
  var card = document.getElementById('pac-card');
  var legend_card = document.getElementById('legend-card');
  var input = document.getElementById('debris-form-location');
  var types = document.getElementById('type-selector');
  var strictBounds = document.getElementById('strict-bounds-selector');

  //Testing appending list elements
  //$('#slide-out').append('<li><a class="waves-effect" href="#!"><img class="avatar" src="http://www.buzzhunt.co.uk/wp-content/2013/07/Tree-in-the-way.jpg">Third Link With Waves</a></li>');
  //use locations from data.js for the markers
  for( i = 0; i < window.markers.length; i++){

    //add the marker to the map
    var currentMarkerReference = addMarkerToMapInstance(window.map, window.markers[i]);
    markers[i].markerReference = currentMarkerReference;

    //stuff for sidebar list
    addMarkerDataToList(markers[i]);
  }

  console.log(markers);

  window.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);
  window.map.controls[google.maps.ControlPosition.LEFT_CENTER].push(legend_card);

  var autocomplete = new google.maps.places.Autocomplete(input);

  // Bind the map's bounds (viewport) property to the autocomplete object,
  // so that the autocomplete requests use the current map bounds for the
  // bounds option in the request.
  autocomplete.bindTo('bounds', window.map);

  var infowindow = new google.maps.InfoWindow();
  var infowindowContent = document.getElementById('infowindow-content');
  infowindow.setContent(infowindowContent);

  var marker = new google.maps.Marker({
    map: window.map,
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

    window.map.setCenter(place.geometry.location);
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
    infowindow.open(window.map, marker);
  });

  window.INITIALIZING = false;

}

function geoLocate(){
  var infoWindow;
  infoWindow = new google.maps.InfoWindow;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      infoWindow.setPosition(pos);
      Materialize.toast('Location Found!', 3000, 'rounded')
      window.map.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindow, window.map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, window.map.getCenter());
  }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  Materialize.toast('You need to enable geolocation', 3000, 'rounded geolocation-error')
  }

  function markerDataToContent(marker){

    //generate the content string
    var contentString = "<div><img width='180px' src="
    + "'" + marker.markerUrl + "''"
    + "/></div>"
    + "<a style='width: 180px;' class='waves-effect waves-light btn modal-trigger' href='#modal2'>Resolve</a>";

    return contentString;

  }

  function debrisResolveSubmitFormToData(markerReference, formData){

    //generate the content string
    var contentString = "<div><img width='180px' src="
    + "'" + markerReference.debrisData.markerUrl + "''"
    + "/></div>"
    + formData.name + " will resolve the debris on " + formData.date;

    var infoWindow = new google.maps.InfoWindow({
      content: contentString, 
      maxWidth: 200
    });

    console.log(contentString);

    markerReference.content = contentString;

    clearInfoWindows();
    infoWindow.open(markerReference.getMap(), markerReference);

    window.previousInfoWindow = infoWindow;

    return contentString;
  }

  function addMarkerDataToList(marker, id){

    var contentString = '<li><a id="' + marker.description + '" class="waves-effect debris-list-element" href="#!"><img class="avatar" src='
      + ' " ' + marker.markerUrl + ' " >'
      + marker.description +
      '</a></li>'; 

    var $listElement = $(contentString);

    $('#slide-out').append($listElement); 

  }

  function addMarkerToMapInstance(mapInstance, marker){

    //load position from data.js
    var position = new google.maps.LatLng(marker['location']['lat'], marker['location']['lng']);

    //generate content string based on url
    var contentString = markerDataToContent(marker);

    markerRef = new google.maps.Marker({
      icon: window.RED_MARKER_URL,
      position: position,
      map: mapInstance,
      title: marker['description'],
    });

    markerRef.content = contentString;
    var infoWindow = new google.maps.InfoWindow({
      maxWidth: 200
    });

    markerRef.addListener('click', function(){
      clearInfoWindows();      
      window.currentMarker = this;      
      infoWindow.setContent(this.content);
      infoWindow.open(this.getMap(), this);
      window.previousInfoWindow = infoWindow;
    });

    markerRef.debrisData = marker;    

    //set the marker debris data
    if(!window.INITIALIZING){
      markers[markers.length - 1].markerReference = markerRef;
      console.log(markers);
    }

    return markerRef;

  }

function clearInfoWindows(){
  console.log("CLOSING PREVIOUS INFO WINDOW!"); 
  if(window.previousInfoWindow != null){
    window.previousInfoWindow.close();
  }
}