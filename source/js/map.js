"use strict";

function initMap() {
  var markerImage = {
    url: 'img/map-marker.svg',
    scaledSize: new google.maps.Size(54, 54)
  };

  if (window.matchMedia("(max-width: 767px)").matches) {
    markerImage.scaledSize = new google.maps.Size(41, 41)
  }

  var uluru = {lat: 59.9387165, lng: 30.3208587};
  var map = new google.maps.Map(
      document.getElementById('map'), {
        zoom: 15,
        center: uluru,
        disableDefaultUI: true
      });
  var marker = new google.maps.Marker({
    position: uluru,
    map: map,
    icon:  markerImage
  });
}
