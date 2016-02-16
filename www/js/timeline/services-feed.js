angular.module('starter.services-feed', [])

.factory('Topics', function(){
    var menuItems = [{text: 'Nightlife'}, {text: 'Events'}, {text: "Fitness"}, {text: 'Sports'}, {text: 'Food'}, {text: 'Trending'}];
    return {
        all: function() {
            return menuItems;
        }
    }
})
