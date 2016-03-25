angular.module('starter.controllers-meet', [])

    .controller('MeetCtrl', function ($scope, $http, $ionicLoading, $ionicSideMenuDelegate, TDCardDelegate) {
        console.log('MEET CTRL');
        $ionicSideMenuDelegate.canDragContent(false);
        var cardTypes = [];
        $ionicLoading.show();
        $http.get('https://randomuser.me/api/?gender=female&results=50').success(function (response) {
            angular.forEach(response.results, function (famous) {
                cardTypes.push(famous);
                //console.log(JSON.stringify(famous));
            });
            $ionicLoading.hide();
        }).error(function (err) {
            console.log(err);
        });

        //$scope.cards = Array.prototype.slice.call(cardTypes, 0);
        $scope.cards = cardTypes;
        $scope.cardDestroyed = function(index) {
            $scope.cards.splice(index, 1);
        };

        $scope.addCard = function() {
            var newCard = cardTypes[Math.floor(Math.random() * cardTypes.length)];
            newCard.id = Math.random();
            $scope.cards.push(angular.extend({}, newCard));
        }

        $scope.yesCard = function() {
            console.log('YES');
            $scope.addCard();
        };

        $scope.noCard = function() {
            console.log('NO');
            $scope.addCard();
        };
        $scope.toggleLeft = function() {
            $ionicSideMenuDelegate.toggleLeft();
        };
    })
    //.controller('CardCtrl', function($scope, TDCardDelegate) {
    //    $scope.cardSwipedLeft = function(index) {
    //        console.log('LEFT SWIPE');
    //        $scope.addCard();
    //    };
    //    $scope.cardSwipedRight = function(index) {
    //        console.log('RIGHT SWIPE');
    //        $scope.addCard();
    //    };
    //})
