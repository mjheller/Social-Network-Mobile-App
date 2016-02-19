angular.module('starter.controllers-map', [])

.controller('MapCtrl', function($scope, $state, $stateParams, $cordovaGeolocation) {


    google.maps.event.addDomListener(window, 'load', function () {
        $scope.initialise = function () {
            console.log("In Google.maps.event.addDomListener");
            var myLatlng = new google.maps.LatLng(37.3000, -120.4833);
            var mapOptions = {
                center: myLatlng,
                zoom: 16,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };


            console.log(mapOptions);
            var map = new google.maps.Map(document.getElementById("map"), mapOptions);

        }
    });
})
