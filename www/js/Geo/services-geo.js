/**
 * Created by mjheller on 2/10/16.
 */
(function() {

  var app = angular.module('starter.services-geo', ['ionic', 'ngCordova']);

  app.factory('GeoService', function($ionicPlatform, $cordovaGeolocation) {

    var positionOptions = {timeout: 10000, enableHighAccuracy: true};

    return {
      getPosition: function() {
        return $ionicPlatform.ready()
          .then(function() {
            return $cordovaGeolocation.getCurrentPosition(positionOptions);
          })
      }
    };

  });

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

  });

  app.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  });

}());
