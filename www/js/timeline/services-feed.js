angular.module('starter.services-feed', [])

.factory('Topics', function(){
    var menuItems = [{text: 'Nightlife'}, {text: 'Events'}, {text: "Fitness"}, {text: 'Sports'}, {text: 'Food'}, {text: 'Trending'}];
    return {
        all: function() {
            return menuItems;
        }
    }
})

.service('currentTopic', function($stateParams,$http){
    var getTopic = function($stateParams) {
        var topic = $http.get($stateParams.topic);
        return topic
    };
    var getStateParams = function() {
        return $stateParams;
    };

    return {
        getTopic: getTopic,
        getStateParams: getStateParams,
    };
})

