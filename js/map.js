function initMap() {
  var initialLocation = {lat: 38.164871, lng: -85.58541799999999};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: initialLocation
  });

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
  document.getElementById("submit-report").addEventListener("click", function(){
    var latitude = document.getElementById("latitude").value;
    var longitude = document.getElementById("longitude").value;
    console.log(latitude, longitude);
    var position = new google.maps.LatLng(latitude, longitude);
    addMarker(position);
  });
  // 38.185, -85.591749
  function addMarker(location) {
    var icon = new google.maps.Marker({
      position: location,
      map: map,
    });
    markers.push(icon);
    console.log("successfully pushed marker");
  }
}
