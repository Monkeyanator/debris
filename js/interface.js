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

// if we cancel the btn, we reset all values to default and we hide
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
    var name = $("#resolve-debris-name").val();
    var email = $("#resolve-debris-email").val();
    var phone = $("#resolve-debris-phone_number").val();
    var organization = $("#resolve-debris-organization").val();
    var plan = $("#resolve-debris-plan").val();
    var datepicker = $("#resolve-debris-datepicker").val();
//bug testing
    console.log(name);
    console.log(email);
    console.log(phone);
    console.log(organization);
    console.log(plan);
    console.log(datepicker);
    Materialize.toast('Debris Resolved', 4000, 'rounded')
  });

  // set up events for form submission
  $("#form-btn-submit").click(() => {
    var geocoder = new google.maps.Geocoder();
    var address = $("#debris-form-location").val();
    var title = $("#debris-form-title").val();
    var description = $("#debris-form-description").val();

    if (title == "" || description == "" || address == {}){
      Materialize.toast("Please fill out the form!", 4000,"rounded")
      return;
    }

    geocoder.geocode({'address': address}, function(results, status) {
      if (status == 'OK') {
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
        addMarkerDataToList(newMarker);
        //reset form to empty
        $("#debris-form-title").val("");
        $("#debris-form-description").val("");
        $("#debris-form-location").val(null);
        // Materialize.toast(message, displayLength, className, completeCallback);
        $("#pac-card").hide();
        Materialize.toast('Debris reported!', 4000, 'rounded'); // 4000 is the duration of the toast

      }
      else if (status == "INVALID_REQUEST" || status == "ZERO_RESULTS"){
        Materialize.toast("Please enter a valid address!", 4000,"rounded");
      }

      else {
        Materialize.toast('Geocode was not successful for the following reason: '+ status, 4000, 'rounded');
      }
    });

  });

});
