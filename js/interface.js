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

  $('#btn-get-geo').click(() => {
    geoLocate();
  });

  
  //set up events for resolving debris submission
  $("#resolve-debris-submit").click(() => {

    //display materialize
    Materialize.toast('Debris Resolved', 4000, 'rounded');

    var name = $("#resolve-debris-name").val();
    var email = $("#resolve-debris-email").val();
    var phone = $("#resolve-debris-phone_number").val();
    var organization = $("#resolve-debris-organization").val();
    var plan = $("#resolve-debris-plan").val();
    var date = $("#resolve-debris-datepicker").val();

    var formData = {name: name, email: email, phone: phone, date: date};

    //change current marker color
    window.currentMarker.setIcon(window.YELLOW_MARKER_URL);
    debrisResolveSubmitFormToData(window.currentMarker, formData);

  });

  //set up events for form submission
  $("#form-btn-submit").click(() => {
    $("#pac-card").hide();
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
        //reset form to empty
        $("#debris-form-title").val("");
        $("#debris-form-description").val("");
        $("#debris-form-location").val(null);
        // Materialize.toast(message, displayLength, className, completeCallback);
        Materialize.toast('Debris reported!', 4000, 'rounded') // 4000 is the duration of the toast

      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });

  });

});
