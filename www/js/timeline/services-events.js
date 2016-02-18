angular.module('starter.services-events', [])

  .service('Events', function($http, $cordovaGeolocation) {
    $http.get('http://api.eventful.com/json/events/search?app_key=Ft9wPKxgKXZG6s9s&location=Milwaukee&page_size=20').then(function (response) {
      return response.data.events;
    });
  })





