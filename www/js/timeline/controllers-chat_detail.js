angular.module('starter.controllers-chat_detail', [])

    .controller('ChatDetailCtrl', function($scope, $state, $stateParams, Chats, Utils, Auth, Messages, $ionicHistory) {

        $scope.$on('$ionicView.leave', function () {
            $ionicHistory.clearHistory();
            $ionicHistory.clearCache();
        });

        $scope.friendID = $stateParams.recipientID;
        $scope.friendUsername = $stateParams.recipientUsername;
        Messages.getMessages(Auth.AuthData.uid, $scope.friendID).then(function (response) {
            $scope.messages= response;
        });




        $scope.$on('$ionicView.enter', function () {
            $scope.friendID = $stateParams.recipientID;
            $scope.friendUsername = $stateParams.recipientUsername;
            Messages.getMessages(Auth.AuthData.uid, $scope.friendID).then(function (response) {
                $scope.messages = response;
                console.log($scope.messages);

            });

        });


        $scope.sendReply = function (recipientID, recipientUsername) {
            $state.go('sendMessage', {recipientID: recipientID, recipientUser: recipientUsername, firstMessage: false});
        };

        $scope.remove = function (chat) {
            Chats.remove(chat);
        };


        $scope.$ionicGoBack = function() {
            console.log('registed');
            $state.go('tab.chats');
        };


    })



