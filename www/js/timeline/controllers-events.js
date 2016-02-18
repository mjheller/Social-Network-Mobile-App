angular.module('starter.controllers-events', [])


  .controller('EventsCtrl', function($scope, $state , $stateParams,
                                   $ionicSlideBoxDelegate, $ionicPopup, $ionicActionSheet, $ionicHistory,
                                   Auth, Events, Timeline, Utils, Profile, Topics, currentTopic, Followers, $cordovaGeolocation, $http) {


    $scope.events = {};
    $scope.testEvents = Events;

    $scope.$on('$ionicView.enter', function() {
      $http.get('http://api.eventful.com/json/events/search?app_key=Ft9wPKxgKXZG6s9s&location=Milwaukee&page_size=20').then(function (response) {
        $scope.events = response.data.events.event;
        console.log($scope.events);

      });


    });


  })


