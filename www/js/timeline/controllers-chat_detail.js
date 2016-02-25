angular.module('starter.controllers-chat_detail', [])

    .controller('ChatDetailCtrl', function($scope, $state, $stateParams, Chats, Utils, Auth, Messages, $ionicHistory) {

        $scope.$on('$ionicView.leave', function(){
            $ionicHistory.clearHistory();
            $ionicHistory.clearCache();
        });

        $scope.friendID = $stateParams.recipientID;
        console.log('friendID ', $scope.friendID);
        var chats = [];
        Messages.getMessages(Auth.AuthData.uid, $scope.friendID).then(function(response){
            //response.forEach(function(data){
                //console.log(data);
                //chats.push(data);
            console.log(response);
            $scope.messages= response;

            });

        $scope.reply = function() {
            $state.go('sendMessage', {recipientID: $scope.friendID, recipientUser: $scope.messages.UserData.username });
        };



        $scope.remove = function(chat) {
            Chats.remove(chat);
        };

    })





