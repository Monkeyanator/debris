$(document).ready(function(){

    //hide card on submit, show when report debris is pressed
    //toggle when pressing report debris
    $("#report-debris-button").click(() => {
        if($("#pac-card").is(":visible")){
            $("#pac-card").hide();
        } else{
            $("#pac-card").show();
        }
    });

    $("#form-btn-cancel").click(() => {
            $("#pac-card").hide();
            $("#debris-form-title").val("");
            $("#debris-form-description").val("");
            $("#debris-form-location").val(null);
    });

    //set up events for form submission
    $("#form-btn-submit").click(() => {
      // Materialize.toast(message, displayLength, className, completeCallback);
      Materialize.toast('Debris reported!', 4000, 'rounded') // 4000 is the duration of the toast

        var geocoder = new google.maps.Geocoder();
        var address = $("#debris-form-location").val();

        geocoder.geocode({'address': address}, function(results, status) {
            if (status == 'OK') {

              //grab form data
              var title = $("#debris-form-title").val();
              var description = $("#debris-form-description").val();

              //grab the location
              var location = results[0].geometry.location;
              var lat = location.lat();
              var lng = location.lng();

              //intialize marker data
              var newMarker = {};
              newMarker.location = {};
              newMarker.location.lat = lat;
              newMarker.location.lng = lng;
              newMarker.title = title;
              newMarker.description = description;
              newMarker.markerUrl = "http://probalrashid.com/wp-content/uploads/2015/05/IMG_7184.jpg";

              console.log(newMarker);

              //add marker
              markers.push(newMarker);
              addMarkerToMapInstance(window.map, newMarker);
              $("#debris-form-title").val("");
              $("#debris-form-description").val("");
              $("#debris-form-location").val(null);
              $("#pac-card").hide();
            } else {
              alert('Geocode was not successful for the following reason: ' + status);
            }
          });

    });

});
