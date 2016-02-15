/**
 * Created by mjheller on 2/10/16.
 */

app.controller('LocationCtrl', function($scope, GeoService) {

  function showMap(coords) {
    var mapOptions = {
      center: { lat: coords.latitude, lng: coords.longitude},
      zoom: 8
    };
    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  }

  GeoService.getPosition()
    .then(function(position) {
      $scope.coords = position.coords;
      showMap(position.coords);
    }, function(err) {
      console.log('getCurrentPosition error: ' + angular.toJson(err));
    });
})

